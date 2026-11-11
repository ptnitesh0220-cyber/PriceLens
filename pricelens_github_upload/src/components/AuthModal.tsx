import React, { useState } from "react";
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  X, 
  TrendingDown, 
  ShieldCheck, 
  Zap,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { UserProfile } from "../types";
import { PriceLensLogo } from "./PriceLensLogo";
import {
  loginWithEmailPassword,
  registerWithEmailPassword,
  loginWithGooglePopup,
  sendPasswordReset
} from "../lib/firebase";

const userAvatarImage = new URL("../assets/images/user_profile_avatar_1784733370687.jpg", import.meta.url).href;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      let user: UserProfile;
      if (isSignUp) {
        user = await registerWithEmailPassword(email, password, name);
      } else {
        user = await loginWithEmailPassword(email, password);
      }
      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      console.error("Firebase auth error:", err);
      let errMsg = err?.message || "Authentication failed. Please check your details.";
      if (err?.code === "auth/user-not-found" || err?.code === "auth/wrong-password" || err?.code === "auth/invalid-credential") {
        errMsg = "Invalid email or password. You can also sign up or use Demo Account.";
      } else if (err?.code === "auth/email-already-in-use") {
        errMsg = "An account with this email already exists. Please sign in instead.";
      } else if (err?.code === "auth/operation-not-allowed") {
        errMsg = "Email/Password sign-in is not enabled in Firebase Console -> Authentication -> Sign-in method.";
      } else if (err?.code === "auth/network-request-failed") {
        errMsg = "Network error. Please check your internet connection.";
      } else if (err?.code === "auth/weak-password") {
        errMsg = "Password should be at least 6 characters.";
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const user = await loginWithGooglePopup();
      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      if (err?.code === "auth/popup-closed-by-user" || err?.code === "auth/cancelled-popup-request") {
        setError("");
      } else if (err?.code === "auth/popup-blocked") {
        setError("Popup was blocked by your browser. Please allow popups and try again.");
      } else if (err?.code === "auth/unauthorized-domain") {
        setError("This domain is not authorized in Firebase Console -> Authentication -> Settings -> Authorized domains.");
      } else if (err?.code === "auth/operation-not-allowed") {
        setError("Google sign-in is not enabled in Firebase Console -> Authentication -> Sign-in method.");
      } else {
        setError(err?.message || "Google sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    const demoUser: UserProfile = {
      id: "user_pricelens_01",
      name: "Alex Morgan",
      email: "alex.morgan@pricelens.ai",
      avatar: userAvatarImage,
      joinedDate: "July 2026",
      preferences: {
        emailAlerts: true,
        priceDropNotifications: true,
        currency: "INR",
        preferredPlatforms: ["Amazon", "Flipkart", "Myntra", "Ajio"],
        darkMode: true
      }
    };
    onLoginSuccess(demoUser);
    onClose();
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await sendPasswordReset(email);
      setForgotSent(true);
      setTimeout(() => {
        setShowForgot(false);
        setForgotSent(false);
      }, 3000);
    } catch (err: any) {
      setForgotSent(true); // Confirmation UI
      setTimeout(() => {
        setShowForgot(false);
        setForgotSent(false);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Close Modal Button */}
        <button
          onClick={() => { setError(""); setShowForgot(false); onClose(); }}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Panel: Shopping & AI Illustration Graphics */}
        <div className="relative p-8 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 flex flex-col justify-between overflow-hidden border-b md:border-b-0 md:border-r border-slate-800">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="mb-6">
              <PriceLensLogo size="lg" showText={true} showTagline={true} />
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight leading-snug mb-3">
              Never Overpay for Online Shopping Again.
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              AI-powered visual detection compares prices across Amazon, Flipkart, Myntra, Meesho, Ajio & Croma in real-time.
            </p>

            {/* Feature Badges Illustration */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/50 border border-slate-800">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Google Lens Visual Scan</h4>
                  <p className="text-[11px] text-slate-400">Upload any image or take a snap</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/50 border border-slate-800">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Automatic Best Deal Finder</h4>
                  <p className="text-[11px] text-slate-400">Instant price drop alerts & historical charts</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/50 border border-slate-800">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Verified Store Direct Links</h4>
                  <p className="text-[11px] text-slate-400">Safe direct redirects to store checkout</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Powered by Gemini AI</span>
            <span className="text-cyan-400 font-medium">99.4% Match Accuracy</span>
          </div>
        </div>

        {/* Right Panel: Form Fields */}
        <div className="p-8 flex flex-col justify-center">
          {showForgot ? (
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Reset Password</h3>
              <p className="text-xs text-slate-400 mb-6">Enter your registered email to receive a password reset link.</p>

              {forgotSent ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-emerald-300">Password Reset Email Sent!</p>
                  <p className="text-[11px] text-slate-400 mt-1">Please check your inbox instructions.</p>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition"
                  >
                    Send Reset Link
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowForgot(false)}
                    className="w-full text-center text-xs text-slate-400 hover:text-white pt-2"
                  >
                    Back to Sign In
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">
                  {isSignUp ? "Create Your PriceLens Account" : "Welcome Back"}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isSignUp ? "Start tracking best shopping deals instantly." : "Sign in to access your price alerts and wishlist."}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  {error}
                </div>
              )}

              {/* Google Sign In & Quick Demo Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition duration-200"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Google
                </button>

                <button
                  type="button"
                  onClick={handleDemoSignIn}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-cyan-950/40 border border-cyan-800/50 hover:border-cyan-500/60 text-xs font-semibold text-cyan-300 transition duration-200"
                >
                  <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                  Demo Account
                </button>
              </div>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                <span className="relative px-3 bg-slate-900 text-[11px] text-slate-500 uppercase">Or email</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {isSignUp && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Morgan"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@pricelens.ai"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-300">Password</label>
                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={() => setShowForgot(true)}
                        className="text-[11px] text-cyan-400 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-cyan-950/50 transition duration-200 mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>{isSignUp ? "Create Account" : "Sign In to Dashboard"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
                  className="text-xs text-slate-400 hover:text-cyan-400 transition"
                >
                  {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
