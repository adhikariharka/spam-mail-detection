import Link from 'next/link';
import { ArrowLeft, BarChart2, Shield } from 'lucide-react';

export default function Docs() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full border-b border-white/5">
                <Link href="/" className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back the Checker</span>
                </Link>
                <div className="flex items-center space-x-2">
                    <Shield className="w-6 h-6 text-indigo-400" />
                    <span className="font-bold text-lg">SpamShield Docs</span>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto p-6 py-12">
                <h1 className="text-4xl font-bold mb-8 text-indigo-100">How it Works</h1>

                <section className="mb-12 space-y-6">
                    <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                        <BarChart2 className="w-6 h-6 text-emerald-400" />
                        Model Architecture & Comparison
                    </h2>
                    <div className="bg-slate-900/50 p-6 rounded-xl border border-white/10 text-slate-300 leading-relaxed">
                        <p className="mb-4">
                            We evaluated multiple Machine Learning algorithms to find the most effective model for spam detection.
                            The system utilizes a standard **NLP Pipeline**: **TF-IDF Vectorization** followed by classification.
                        </p>
                        <p className="mb-4 text-slate-400">
                            We tested the following models:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-slate-400 mb-6">
                            <li><strong>Support Vector Machine (SVM)</strong>: Excellent for high-dimensional text data.</li>
                            <li><strong>Naive Bayes (NB)</strong>: Probabilistic classifier commonly used for text.</li>
                            <li><strong>Random Forest (RF)</strong>: Ensemble learning method for robust predictions.</li>
                            <li><strong>Logistic Regression (LR)</strong>: Linear model for binary classification.</li>
                        </ul>

                        {/* Model Comparison Chart */}
                        <div className="mb-8">
                            <h3 className="text-lg font-medium text-slate-200 mb-4">Performance Comparison</h3>
                            <div className="aspect-video bg-slate-900 rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
                                <img src="/images/model_comparison.png" alt="Model Comparison Graph" className="w-full h-full object-contain" />
                            </div>
                            <p className="text-sm text-slate-500 mt-2 text-center">
                                Comparison of Accuracy and F1-Score across different models.
                            </p>
                        </div>

                        {/* Metrics Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-400 border border-white/10 rounded-lg">
                                <thead className="text-xs text-slate-200 uppercase bg-slate-900/50 border-b border-white/10">
                                    <tr>
                                        <th className="px-6 py-3">Model</th>
                                        <th className="px-6 py-3">Accuracy</th>
                                        <th className="px-6 py-3">Precision (Spam)</th>
                                        <th className="px-6 py-3">Recall (Spam)</th>
                                        <th className="px-6 py-3">F1-Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-slate-900/20 border-b border-white/5 hover:bg-slate-800/20 cursor-default transition-colors">
                                        <td className="px-6 py-4 font-medium text-emerald-400">SVM (Best)</td>
                                        <td className="px-6 py-4">98.2%</td>
                                        <td className="px-6 py-4">98.5%</td>
                                        <td className="px-6 py-4">88.0%</td>
                                        <td className="px-6 py-4">93.0%</td>
                                    </tr>
                                    <tr className="bg-slate-900/20 border-b border-white/5 hover:bg-slate-800/20 cursor-default transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-200">Random Forest</td>
                                        <td className="px-6 py-4">97.9%</td>
                                        <td className="px-6 py-4">100%</td>
                                        <td className="px-6 py-4">84.7%</td>
                                        <td className="px-6 py-4">91.7%</td>
                                    </tr>
                                    <tr className="bg-slate-900/20 border-b border-white/5 hover:bg-slate-800/20 cursor-default transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-200">Naive Bayes</td>
                                        <td className="px-6 py-4">97.0%</td>
                                        <td className="px-6 py-4">100%</td>
                                        <td className="px-6 py-4">78.0%</td>
                                        <td className="px-6 py-4">87.6%</td>
                                    </tr>
                                    <tr className="bg-slate-900/20 hover:bg-slate-800/20 cursor-default transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-200">Logistic Regression</td>
                                        <td className="px-6 py-4">96.2%</td>
                                        <td className="px-6 py-4">100%</td>
                                        <td className="px-6 py-4">72.0%</td>
                                        <td className="px-6 py-4">83.7%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <section className="mb-12 space-y-6">
                    <h2 className="text-2xl font-semibold text-white">Best Model Performance (SVM)</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Confusion Matrix Image */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-slate-200">Confusion Matrix</h3>
                            <div className="aspect-square bg-slate-900 rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
                                <img src="/images/confusion_matrix.png" alt="Confusion Matrix" className="w-full h-full object-contain" />
                            </div>
                            <p className="text-sm text-slate-400">
                                The confusion matrix shows the accuracy of True Positives (correctly identified spam) vs False Positives (legitimate emails marked as spam).
                            </p>
                        </div>

                        {/* ROC Curve Image */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-slate-200">ROC Curve</h3>
                            <div className="aspect-square bg-slate-900 rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
                                <img src="/images/roc_curve.png" alt="ROC Curve" className="w-full h-full object-contain" />
                            </div>
                            <p className="text-sm text-slate-400">
                                The ROC curve illustrates the diagnostic ability of the classifier system as its discrimination threshold is varied.
                            </p>
                        </div>

                        {/* Additional Metrics */}
                        <div className="space-y-4 md:col-span-2">
                            <h3 className="text-lg font-medium text-slate-200">Key Statistics (Real-time)</h3>
                            <div className="bg-slate-900 rounded-xl border border-white/10 p-6 space-y-6">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-400">Accuracy</span>
                                        <span className="text-emerald-400">98.2%</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[98.2%]"></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-400">Precision (Spam)</span>
                                        <span className="text-indigo-400">99.0%</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 w-[99.0%]"></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-400">Recall (Spam)</span>
                                        <span className="text-purple-400">88.0%</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 w-[88.0%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-indigo-900/20 border border-indigo-500/20 p-8 rounded-2xl">
                    <h2 className="text-xl font-semibold text-indigo-200 mb-4">Why it matters?</h2>
                    <p className="text-indigo-200/70 leading-relaxed">
                        Spam emails are not just a nuisance; they are often vehicles for phishing attacks and malware.
                        By using machine learning, we can adapt to new spam patterns faster than traditional rule-based filters.
                    </p>
                </section>

            </main>
        </div>
    );
}
