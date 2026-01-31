# Spam Email Detection: A Comparative Analysis of Machine Learning Algorithms

## Abstract
In this project, we developed a machine learning-based system to detect spam emails automatically. We trained and evaluated four distinct algorithms—Support Vector Machine (SVM), Naive Bayes (NB), Random Forest (RF), and Logistic Regression (LR)—to determine the most effective approach for real-time spam classification. Our results indicate that the **Support Vector Machine (SVM)** achieved the highest accuracy of **98.2%**, making it the optimal choice for deployment.

## 1. Introduction
Email spam remains a significant cybersecurity threat, serving as a vector for phishing, malware, and fraud. Traditional rule-based filters are often bypassed by evolving spam techniques. This project aims to implement a robust, learning-based detection system capable of distinguishing between legitimate (Ham) and unwanted (Spam) emails with high precision.

## 2. Methodology

### 2.1 Dataset
The model was trained on a dataset containing labeled email messages.
- **Source**: `dataset.csv`
- **Labels**:
    - `0` (Spam): Unwanted commercial email or malicious content.
    - `1` (Ham): Legitimate user correspondence.
- **Preprocessing**:
    - Lowercasing: Converting all text to lowercase.
    - Cleaning: Removal of special characters, HTML tags, and punctuation.
    - Vectorization: **TF-IDF (Term Frequency-Inverse Document Frequency)** was used to convert text into numerical feature vectors (top 5000 features).

### 2.2 Algorithms Evaluated
We implemented and compared the following classifiers using the Scikit-learn library:

1.  **Support Vector Machine (SVM)**: Uses a `sigmoid` kernel. Effective for high-dimensional spaces like text data.
2.  **Naive Bayes (MultinomialNB)**: A probabilistic classifier based on Bayes' theorem, widely used as a baseline for text classification.
3.  **Random Forest (RF)**: An ensemble method that constructs multiple decision trees to reduce overfitting and improve accuracy.
4.  **Logistic Regression (LR)**: A linear model that estimates probabilities using a logistic function.

## 3. Experimental Results

The models were evaluated on a held-out test set (20% of the data). Key performance metrics include Accuracy, Precision, Recall, and F1-Score.

| Model | Accuracy | Precision (Spam) | Recall (Spam) | F1-Score |
| :--- | :--- | :--- | :--- | :--- |
| **SVM** | **98.21%** | 98.5% | **88.0%** | **93.0%** |
| Random Forest | 97.94% | **100.0%** | 84.7% | 91.7% |
| Naive Bayes | 97.04% | 100.0% | 78.0% | 87.6% |
| Logistic Regression | 96.23% | 100.0% | 72.0% | 83.7% |

### 3.1 Analysis
- **SVM** provided the best overall balance between Precision and Recall. While RF and NB achieved perfect Precision (no false positives), their Recall was significantly lower, meaning they missed more actual spam emails.
- **SVM's Higher Recall (88%)** is crucial for a spam filter, ensuring fewer spam emails reach the user's inbox while maintaining a very low false positive rate.

## 4. System Implementation
The final system is deployed using a modern tech stack:
- **Backend**: FastAPI (Python) serving the trained SVM model.
- **Frontend**: Next.js (React) providing a user-friendly interface.
- **Visualization**: Comparison charts and Confusion Matrix generated via Matplotlib/Seaborn.

## 5. Conclusion
This study demonstrates that while multiple algorithms can effectively detect spam, Support Vector Machine outperforms others in identifying spam messages (Recall) without sacrificing accuracy. The developed web application successfully integrates this model to provide real-time protection.

## 6. Future Work
- Implement Deep Learning models (LSTM/BERT) for potentially higher accuracy.
- Add user feedback loops to retrain the model on new spam patterns.

## 7. Challenges & Limitations
- **Data Imbalance**: The dataset had more ham than spam, requiring careful evaluation using F1-score rather than just Accuracy.
- **Evolving Spam**: Static models may become obsolete as spammers change tactics; continuous retraining is needed.

## 8. References
1. Scikit-learn Documentation: https://scikit-learn.org/
2. FastAPI Documentation: https://fastapi.tiangolo.com/
3. "Spam filtering with Naive Bayes" - various academic papers.

