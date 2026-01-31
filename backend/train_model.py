import pandas as pd
import pickle
import os
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, confusion_matrix, roc_curve, auc, classification_report
from src.utils.email_utils import clean_text

# Paths
DATA_PATH = "backend/data/dataset/dataset.csv"
MODEL_OUTPUT_DIR = "backend/outputs/models"
IMAGE_OUTPUT_DIR = "frontend/public/images"

# Ensure directories exist
os.makedirs(MODEL_OUTPUT_DIR, exist_ok=True)
os.makedirs(IMAGE_OUTPUT_DIR, exist_ok=True)

import json
from sklearn.naive_bayes import MultinomialNB
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

# ... (Previous imports remain, ensure all necessary are present)

def train_and_evaluate():
    print("Loading dataset...")
    df = pd.read_csv(DATA_PATH)
    
    # Preprocessing
    print("Preprocessing data...")
    if 'v1' in df.columns and 'v2' in df.columns:
        df = df.rename(columns={'v1': 'target', 'v2': 'text'})
    elif 'Category' in df.columns and 'Message' in df.columns:
         df = df.rename(columns={'Category': 'target', 'Message': 'text'})
         
    df['target'] = df['target'].map({'spam': 0, 'ham': 1, 'Spam': 0, 'Ham': 1})
    df['clean_text'] = df['text'].apply(clean_text)
    
    # Vectorization
    print("Vectorizing text...")
    vectorizer = TfidfVectorizer(max_features=5000)
    X = vectorizer.fit_transform(df['clean_text']).toarray()
    y = df['target']
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Define Models
    models = {
        "SVM": SVC(kernel='sigmoid', gamma=1.0, probability=True),
        "Naive Bayes": MultinomialNB(),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "Logistic Regression": LogisticRegression(max_iter=1000)
    }
    
    results = {}
    best_model_name = ""
    best_accuracy = 0
    best_model = None

    print(f"Training {len(models)} models...")
    
    for name, model in models.items():
        print(f"Training {name}...")
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
        # Metrics
        acc = accuracy_score(y_test, y_pred)
        report = classification_report(y_test, y_pred, output_dict=True)
        
        # Specific metrics for Spam (Class 0)
        # Note: In our mapping Spam=0, Ham=1. Using classification report dict.
        # classification_report uses strings '0' and '1' as keys.
        spam_metrics = report['0']
        
        results[name] = {
            "accuracy": acc,
            "precision": spam_metrics['precision'],
            "recall": spam_metrics['recall'],
            "f1": spam_metrics['f1-score']
        }
        
        if acc > best_accuracy:
            best_accuracy = acc
            best_model_name = name
            best_model = model

        # Save EACH model
        safe_name = name.replace(" ", "_")
        print(f"Saving {name} to {safe_name}_model.pkl...")
        pickle.dump(model, open(os.path.join(MODEL_OUTPUT_DIR, f"{safe_name}_model.pkl"), "wb"))

    print(f"\nBest Model: {best_model_name} with Accuracy: {best_accuracy:.4f}")

    # Save Vectorizer (Common for all)
    print("Saving vectorizer...")
    pickle.dump(vectorizer, open(os.path.join(MODEL_OUTPUT_DIR, "vectorizer.pkl"), "wb"))
    
    # --- Visualization ---
    
    # 1. Comparison Bar Chart
    print("Generating Comparison Graph...")
    metrics_df = pd.DataFrame(results).T
    
    plt.figure(figsize=(10, 6))
    metrics_df[['accuracy', 'f1']].plot(kind='bar', color=['#10b981', '#6366f1'])
    plt.title('Model Performance Comparison')
    plt.ylabel('Score')
    plt.xlabel('Model')
    plt.ylim(0.8, 1.0)
    plt.legend(loc='lower right')
    plt.xticks(rotation=0)
    plt.tight_layout()
    plt.savefig(os.path.join(IMAGE_OUTPUT_DIR, "model_comparison.png"))
    plt.close()

    # 2. Confusion Matrix (Best Model)
    y_pred_best = best_model.predict(X_test)
    cm = confusion_matrix(y_test, y_pred_best)
    plt.figure(figsize=(6, 5))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=['Spam', 'Ham'], yticklabels=['Spam', 'Ham'])
    plt.title(f'Confusion Matrix ({best_model_name})')
    plt.savefig(os.path.join(IMAGE_OUTPUT_DIR, "confusion_matrix.png"))
    plt.close()
    
    # 3. ROC Curve (Best Model)
    # Target 0 is Spam. We want prob of Spam.
    if hasattr(best_model, "predict_proba"):
        y_prob = best_model.predict_proba(X_test)[:, 0] # Prob of class 0 (Spam)
        # y_test contains 0 for Spam. We treat 0 as "Positive" class for ROC here?
        # Standard ROC expects y_true to include 1 for positive.
        # Let's invert y_test for ROC calculation: 1=Spam, 0=Ham
        y_test_spam = 1 - y_test
        
        fpr, tpr, _ = roc_curve(y_test_spam, y_prob)
        roc_auc = auc(fpr, tpr)
        
        plt.figure(figsize=(6, 5))
        plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'AUC = {roc_auc:.2f}')
        plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
        plt.xlabel('False Positive Rate')
        plt.ylabel('True Positive Rate')
        plt.title(f'ROC Curve ({best_model_name})')
        plt.legend(loc="lower right")
        plt.savefig(os.path.join(IMAGE_OUTPUT_DIR, "roc_curve.png"))
        plt.close()
    else:
        print(f"Skipping ROC for {best_model_name} (no predict_proba)")

    # Save Metrics to JSON for Frontend
    print("Saving metrics to JSON...")
    # Add best model info
    results['best_model'] = best_model_name
    with open(os.path.join("frontend/public/model_metrics.json"), "w") as f:
        json.dump(results, f, indent=4) # Saving to public folder for fetch
        
    # Also save to the IMAGE_OUTPUT_DIR parent (frontend/public) just in case path differs
    # Actually IMAGE_OUTPUT_DIR is "frontend/public/images"
    # So json should go to "frontend/public/model_metrics.json"
    # Adjusted path above assuming script run from root.
    
    print("Multi-model training and generation complete!")

if __name__ == "__main__":
    train_and_evaluate()
