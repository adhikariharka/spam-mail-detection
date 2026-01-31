## Student name: Harka Adhikari
## Student number: 2315355
## Project title: Spam Email Detection
## Link to project video recording: https://drive.google.com/file/d/1b5jaQjmJjTjB1_VguI2rTVpjHdqD54GD/view?usp=sharing


# Spam Email Detection

A modern web application for detecting spam emails using Machine Learning.

## Structure
```
root
├── backend/                # FastAPI backend
│   ├── src/               # Source code
│   │   ├── pipelines/     # ML pipelines
│   │   ├── utils/         # Helper functions
│   │   └── config/        # Configuration
│   ├── data/              # Dataset storage
│   ├── outputs/           # Saved models & logs
│   ├── main.py            # API entry point
│   └── train_model.py     # Training script
├── frontend/               # Next.js frontend
│   ├── public/            # Static assets
│   └── src/               # React components
├── docs.md                 # Detailed project report
└── README.md               # Quick start guide
```

## Setup & Running

### Prerequisites
- Python 3.13+
- Node.js & npm

### 1. Backend Setup

Navigate to the `backend` directory:
```bash
cd backend
```

Create a virtual environment:
```bash
# macOS/Linux
python -m venv venv
source venv/bin/activate

# Windows
# python -m venv venv
# venv\Scripts\activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Run the API server:
```bash
python main.py
```
The API will start at `http://localhost:8000`.

### 2. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.
The app will be available at `http://localhost:3000`.

## Troubleshooting

### Common Issues
1. **ModuleNotFound**: Ensure you activated the virtual environment (`source venv/bin/activate`).
2. **CORS Error**: Check if the backend is running on port 8000.
3. **Model Not Found**: Run `python backend/train_model.py` to generate the model files first.

- **Spam Checker**: Real-time analysis of email content.
- **Documentation**: Visual breakdown of the model performance and architecture at `/docs`.

## Model Training & Visualization

If you need to retrain the model or regenerate the visualization images (Confusion Matrix, ROC Curve):

1. **Ensure the dataset exists**:
   - Location: `backend/data/dataset/dataset.csv`
   - Format: CSV with `v1` (label) and `v2` (text) or `Category`/`Message` columns.

2. **Run the training script**:
   Make sure your backend virtual environment is activated (`source backend/venv/bin/activate`).
   From the project root:
   ```bash
   python backend/train_model.py
   ```

3. **Outputs**:
   - **Model**: Saved to `backend/outputs/models/` (`SVM_model.pkl`, `vectorizer.pkl`).
   - **Visualizations**: Saved to `frontend/public/images/` (`confusion_matrix.png`, `roc_curve.png`).
