import uvicorn
from typing import Dict
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from src.pipeline.prediction_pipeline import PredictionPipeline

app = FastAPI(title="Spam Email Detection API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize pipeline
try:
    pipeline = PredictionPipeline(load_models=True)
except Exception as e:
    print(f"Error loading models: {e}")
    pipeline = None

class EmailRequest(BaseModel):
    content: str

class DetailedResult(BaseModel):
    prediction: str
    confidence: float

class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    is_spam: bool
    spam_score: str
    detailed_results: Dict[str, DetailedResult]

@app.get("/")
def read_root():
    """
    Root endpoint to verify if the API is running.
    """
    return {"message": "Spam Email Detection API is running"}

@app.post("/predict", response_model=PredictionResponse)
def predict_email(email: EmailRequest):
    """
    Predict whether an email is spam or ham.

    Args:
        email (EmailRequest): The email content to analyze.

    Returns:
        PredictionResponse: The prediction result including confidence and details.
    """
    if pipeline is None:
        raise HTTPException(status_code=503, detail="Model pipeline not initialized")
    
    try:
        result = pipeline.predict_single_email(email.content)
        return PredictionResponse(
            prediction=result['prediction'],
            confidence=result.get('confidence', 0.0),
            is_spam=result['prediction'] == "Spam",
            spam_score=result.get('spam_score', "N/A"),
            detailed_results=result.get('detailed_results', {})
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
