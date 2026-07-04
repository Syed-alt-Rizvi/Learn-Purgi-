import React, { useState } from "react";
import { auth, googleProvider, signInWithPopup } from "../lib/firebase";
import { Sparkles, ExternalLink, ShieldCheck, HelpCircle } from "lucide-react";

interface LoginScreenProps {
  onLoginSuccess?: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err: any) {
      console.error("Google login failed:", err);
      // Detailed user-friendly error message
      if (err.code === "auth/popup-blocked") {
        setError("Sign-in popup was blocked by your browser. Please allow popups or use the button below to open the app in a new tab.");
      } else if (err.code === "auth/popup-closed-by-user") {
        setError("The sign-in popup was closed before completing. Please try again.");
      } else if (err.code === "auth/internal-error" || err.message?.includes("cross-origin")) {
        setError("Cross-origin security policy restricted login inside the preview frame. Please click 'Open in New Tab' to sign in successfully.");
      } else {
        setError(err.message || "Failed to sign in with Google. Please try opening the app in a new tab.");
      }
    } finally {
      setLoading(false);
    }
  };

  const openInNewTab = () => {
    window.open(window.location.href, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden text-slate-100 font-sans">
      {/* Dynamic Background Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/30 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10 backdrop-blur-md">
        
        {/* App Logo & Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-3xl animate-pulse">
            🏔️
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full inline-block">
              Regional Language Academy
            </span>
            <h1 className="text-2xl font-black text-slate-100 mt-2.5 tracking-tight font-sans">
              Purgi Language Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
              Linguistic preservation portal for the endangered Purki/Purgi language of Kargil & Ladakh.
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-4 mb-8 bg-slate-950/50 p-5 rounded-2xl border border-slate-800/60">
          <div className="flex items-start gap-3">
            <span className="text-sm mt-0.5">🎓</span>
            <div>
              <h3 className="text-xs font-bold text-slate-200">Interactive Dialect Lessons</h3>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">Comparative Balti-Purki script courses and grammar workbooks.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-sm mt-0.5">🗣️</span>
            <div>
              <h3 className="text-xs font-bold text-slate-200">AI Conversation Tutor</h3>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">Learn context, idioms, and speak with our intelligent dialect coach.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-sm mt-0.5">🌐</span>
            <div>
              <h3 className="text-xs font-bold text-slate-200">Google-backed Security</h3>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">Your progress, points, and certificates are securely synced to Google servers.</p>
            </div>
          </div>
        </div>

        {/* Login Action & Fallbacks */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-12 bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.14-.1.14s1.14 1.14 1.14 1.14l3.19 2.47c1.86-1.72 2.92-4.24 2.92-7.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96L1.29 17.37C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.29A7.18 7.18 0 0 1 4.88 12c0-.8.14-1.57.39-2.29l-3.86-3A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.25 5.37l4.02-3.08z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.63l3.98 3.08c.95-2.85 3.6-4.96 6.73-4.96z"
                />
              </svg>
            )}
            Sign in with Google Account
          </button>

          {/* New Tab Redirection Action */}
          <button
            onClick={openInNewTab}
            className="w-full h-11 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all border border-slate-700 active:scale-95"
          >
            Open in New Tab <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Error Message Panel */}
        {error && (
          <div className="mt-5 p-3 rounded-xl bg-red-950/60 border border-red-900/50 text-[10px] text-red-300 leading-relaxed font-semibold text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Informative Help Notice */}
        <div className="mt-8 pt-5 border-t border-slate-800/80 flex items-start gap-2.5 text-[9px] text-slate-500 leading-normal font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Strict privacy standards: User data is saved directly on Google Cloud Firestore. We will never sell or share your learning records or personal information.
          </span>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-6 text-[10px] text-slate-600 font-bold z-10 flex items-center gap-1.5">
        <span>Developed by Syed Murtaza Rizvi</span>
        <span>•</span>
        <span>Kargil Baltistan Heritage Preservation</span>
      </div>
    </div>
  );
}
