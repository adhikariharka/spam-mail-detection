"use client";

import { useState } from 'react';
import axios from 'axios';
import { Shield, AlertTriangle, CheckCircle, Send, Terminal, Loader2, Sparkles, AlertOctagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const [emailContent, setEmailContent] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckSpam = async () => {
    if (!emailContent.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://localhost:8000/predict', {
        content: emailContent
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      // Artificial delay for UI feel
      await new Promise(r => setTimeout(r, 600));

      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to connect to the analysis engine. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleCheckSpam();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950 text-slate-50">

      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2">
          <Shield className="w-8 h-8 text-indigo-400" />
          <span className="font-bold text-xl tracking-tight">SpamShield AI</span>
        </div>
        <div className="space-x-4">
          <Link href="/" className="text-slate-200 hover:text-white transition-colors">Checker</Link>
          <Link href="/docs" className="text-slate-400 hover:text-white transition-colors">How it Works</Link>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col items-center text-center"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-white to-indigo-200 tracking-tight mb-4">
            Smart Email Analysis
          </h1>
          <p className="text-slate-400 max-w-xl text-lg">
            Detect spam, phishing, and malicious emails instantly using our advanced Machine Learning model.
          </p>
        </motion.div>

        <div className="w-full max-w-3xl relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

          <div className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center space-x-2 mb-4 text-xs font-mono text-slate-500 uppercase tracking-widest">
              <Terminal className="w-4 h-4" />
              <span>Input Console</span>
            </div>

            <textarea
              className="w-full h-48 bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 resize-none font-mono text-sm leading-relaxed"
              placeholder="Paste the email body here..."
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <div className="flex justify-between items-center mt-4">
              <p className="text-xs text-slate-500 hidden md:block">
                <span className="text-slate-400 font-bold">Ctrl + Enter</span> to analyze
              </p>

              <button
                onClick={handleCheckSpam}
                disabled={loading || !emailContent.trim()}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform
                    ${loading || !emailContent.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95'}
                `}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Analyze Email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence mode='wait'>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-full max-w-3xl mt-6"
            >
              <div className={`
                relative overflow-hidden rounded-2xl p-6 border backdrop-blur-md shadow-2xl
                ${result.is_spam
                  ? 'bg-rose-950/30 border-rose-500/30 shadow-rose-900/20'
                  : 'bg-emerald-950/30 border-emerald-500/30 shadow-emerald-900/20'}
                `}>
                <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${result.is_spam ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {result.is_spam ? <AlertOctagon className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${result.is_spam ? 'text-rose-200' : 'text-emerald-200'}`}>
                        {result.is_spam ? 'Spam Detected' : 'Clean Email'}
                      </h2>
                      <p className={`text-sm ${result.is_spam ? 'text-rose-400/80' : 'text-emerald-400/80'}`}>
                        {result.is_spam
                          ? 'Our model identified patterns consistent with spam/phishing.'
                          : 'This email appears safe and legitimate.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end pl-2 border-l border-white/5">
                    <span className="text-xs text-slate-400 uppercase tracking-widest mb-1">Confidence Model</span>
                    <div className="flex items-baseline space-x-1">
                      <span className={`text-3xl font-bold ${result.is_spam ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {result.confidence.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Model Consensus / Detailed Results */}
                {result.detailed_results && (
                  <div className="mt-6 pt-6 border-t border-black/10 dark:border-white/10">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Model Consensus
                      </h3>
                      <span className="text-xs font-mono text-slate-500 bg-slate-900/50 px-2 py-1 rounded">
                        Score: {result.spam_score}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(result.detailed_results).map(([model, data]: any) => (
                        <div key={model} className="bg-slate-900/40 p-3 rounded-lg border border-white/5 flex justify-between items-center group hover:border-white/10 transition-colors">
                          <span className="text-slate-300 font-medium text-sm">{model.replace(/_/g, " ")}</span>
                          <div className="flex items-center space-x-3">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${data.prediction === 'Spam' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                              {data.prediction}
                            </span>
                            <span className="text-xs text-slate-500 font-mono w-12 text-right">{data.confidence.toFixed(1)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 rounded-xl bg-red-950/50 border border-red-900/50 text-red-200 flex items-center space-x-2"
          >
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </motion.div>
        )}
      </main>

      <footer className="p-6 text-center text-slate-600 text-sm">
        Powered by Scikit-learn & Next.js
      </footer>
    </div>
  );
}
