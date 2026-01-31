import mailbox
import pickle
import os
import time
import pandas as pd
from typing import Dict, List, Optional
from pathlib import Path

from src.utils.state import PredictionState
from src.utils.logger import get_logger
from src.config.config import Config
from src.utils.email_utils import extract_body, all_recipients, clean_text

logger = get_logger(__name__)

class PredictionPipeline:
    def __init__(self, load_models: bool = True):
        self.config = Config()
        self.mailbox = None
        self.feature_transformer = None
        self.models = {} # Dictionary to store all models
        # self.model = None # Deprecated single model reference
        
        if load_models:
            self._load_models()
    
    def _load_models(self) -> None:
        logger.info(f"Loading models from {self.config.models_dir}")
        self.feature_transformer = pickle.load(open(self.config.feature_path, "rb"))
        
        # Load all available models
        for model_name in self.config.available_models:
            try:
                path = os.path.join(self.config.models_dir, f"{model_name}_model.pkl")
                if os.path.exists(path):
                    self.models[model_name] = pickle.load(open(path, "rb"))
                    logger.info(f"Loaded {model_name}")
                else:
                    logger.warning(f"Model file not found: {path}")
            except Exception as e:
                logger.error(f"Failed to load {model_name}: {e}")
                
        if not self.models:
            logger.error("No models loaded!")
            
        logger.info("All models loaded successfully")
    
    def predict_single_email(self, email_body: str) -> Dict:
        if not self.models or self.feature_transformer is None:
            self._load_models()

        cleaned_body = clean_text(email_body)
        features = self.feature_transformer.transform([cleaned_body]).toarray()
        
        results = {}
        total_confidence = 0
        spam_votes = 0
        
        # Run prediction on all models
        for name, model in self.models.items():
            try:
                prediction = model.predict(features)
                if len(prediction) == 0:
                     logger.error(f"Model {name} returned empty prediction")
                     results[name] = {"prediction": "Error", "confidence": 0}
                     continue

                prediction_label = "Spam" if str(prediction[0]) == "0" else "Ham"
                
                confidence = 0.0
                if hasattr(model, "predict_proba"):
                    try:
                        proba = model.predict_proba(features)
                        if len(proba) > 0 and len(proba[0]) > 0:
                             confidence = float(max(proba[0])) * 100
                    except Exception as proba_error:
                        logger.warning(f"predict_proba failed for {name}: {proba_error}")

                results[name] = {
                    "prediction": prediction_label,
                    "confidence": confidence
                }
                
                if prediction_label == "Spam":
                    spam_votes += 1
                
            except Exception as e:
                logger.error(f"Prediction failed for {name}: {e}")
                import traceback
                logger.error(traceback.format_exc())
                results[name] = {"prediction": "Error", "confidence": 0}

        # Consensus Logic
        # If majority say Spam, it's Spam. (Spam=0 in our mapping, but label is "Spam")
        # Actually in our mapping: Spam = 0, Ham = 1.
        # Logic above: label "Spam" if '0'.
        
        vote_count = len(self.models)
        is_spam_consensus = spam_votes > (vote_count / 2)
        consensus_prediction = "Spam" if is_spam_consensus else "Ham"
        
        if not results:
             return {
                'prediction': "Error",
                'confidence': 0,
                'detailed_results': {},
                'spam_score': "0/0 Models"
            }

        # Use Best Model (SVM) for primary stats if available, else average or consensus
        primary_model = "SVM" if "SVM" in self.models else list(self.models.keys())[0]
        primary_result = results.get(primary_model, {"confidence": 0})
        
        return {
            'prediction': consensus_prediction, # Or primary_result['prediction']
            'confidence': primary_result['confidence'], # Keep primary confidence for main display
            'detailed_results': results,
            'spam_score': f"{spam_votes}/{vote_count} Models"
        }

    def load_mailbox(self, mailbox_path: str) -> None:
        """Load MBOX file"""

        logger.info(f"Loading mailbox from {mailbox_path}")
        self.mailbox = mailbox.mbox(mailbox_path)
        logger.info(f"Loaded mailbox from {mailbox_path}")

    def process_mailbox(self, mailbox_path: Optional[str] = None) -> List[Dict]:
        if mailbox_path:
            self.load_mailbox(mailbox_path)
        
        if self.mailbox is None:
            raise ValueError("No mailbox loaded. Call load_mailbox() first.")
        
        logger.info("Processing mailbox")
        data = []
        
        for message in self.mailbox:
            labels = (message.get("X-Gmail-Labels") or "").lower()
            category = (
                "Spam" if "spam" in labels else
                "Promotions" if "category_promotions" in labels else
                "Social" if "category_social" in labels else
                "Updates" if "category_updates" in labels else
                "Inbox"
            )
            time_str = message.get("Date", "")
            recipients = clean_text(all_recipients(message))
            subject = clean_text(message.get("Subject", ""))
            body = clean_text(extract_body(message))
            direction = "Sent" if "Sent" in (message.get("X-Gmail-Labels") or "") else "Received"
            
            data.append({
                "Time": time_str,
                "Recipients": recipients,
                "Subject": subject,
                "Body": body,
                "Category": category,
                "Direction": direction
            })
        
        logger.info(f"Processed {len(data)} emails from mailbox")
        self.mailbox.close()
        
        return data
    
    def run_prediction(self, mail_data: List[Dict]) -> List[Dict]:
        if self.model is None or self.feature_transformer is None:
            self._load_models()
        
        start_time = time.time()
        logger.info("Running predictions")
        
        for mail in mail_data:
            body_text = mail.get('Body', '')
            features = self.feature_transformer.transform([body_text])
            prediction = self.model.predict(features)
            prediction_label = "Spam" if str(prediction[0]) == "0" else "Ham"
            mail["Prediction"] = prediction_label
        
        end_time = time.time()
        logger.info(f"Prediction completed in {end_time - start_time:.2f} seconds")
        
        return mail_data
    
    def predict_mbox_file(self, mailbox_path: str, output_path: Optional[str] = None) -> pd.DataFrame:
        mail_data = self.process_mailbox(mailbox_path)
        mail_data = self.run_prediction(mail_data)
        df = pd.DataFrame(mail_data)
        if output_path:
            df.to_csv(output_path, index=False)
            logger.info(f"Predictions saved to {output_path}")
        return df


def run_legacy_pipeline(state: PredictionState) -> None:
    pipeline = PredictionPipeline(load_models=False)
    pipeline.load_mailbox(state.mailbox_path)
    mail_data = pipeline.process_mailbox()
    state.mail_data = mail_data
    state.mail_data = pipeline.run_prediction(state.mail_data)
    df = pd.DataFrame(state.mail_data)
    df.to_csv("data/predictions.csv", index=False)