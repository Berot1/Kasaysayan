"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, AlertCircle, Mail, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(() => {
    if (typeof window === 'undefined') return true;
    const params = new URLSearchParams(window.location.search);
    return params.get('signup') !== 'true';
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // OTP States
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  // Secure Password Policy Checker
  const isPasswordSecure = (pwd: string) => {
    const minLength = 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    return pwd.length >= minLength && hasUpper && hasLower && hasNumber && hasSpecial;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        // --- LOGIN FLOW ---
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/dashboard');
      } else {
        // Check password security first
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        if (!isPasswordSecure(password)) throw new Error("Password does not meet security requirements.");

        // Use signUp with email and password
        const { error } = await supabase.auth.signUp({ 
            email, 
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/dashboard`
            }
        });
        if (error) throw error;
        
        // Now this will correctly update the UI to show the verification step
        setOtpSent(true); 
        setMessage("Check your email to verify your account.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup'
      });
      
      if (error) throw error;
      
      // Successfully verified, redirect to dashboard
      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Invalid OTP code. Please check your email and try again.");
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      if (error) throw error;
      setMessage("A new code has been sent to your inbox.");
      setResendCooldown(30);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` }
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col justify-center items-center p-6 text-[#201F1C] selection:bg-[#F1E2B8] font-sans">
      
      <Link href="/" className="mb-10 flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-[#E6E2D8] bg-[#FAF8F4] shadow-sm">
          <Image src="/logo2.png" alt="Kasaysayan logo" fill sizes="40px" className="object-cover" />
        </div>
        <span className="font-semibold text-xl tracking-tight">Kasaysayan</span>
      </Link>

      <div className="w-full max-w-[400px]">
        <div className="bg-white border border-[#E6E2D8] rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center">
          
          <h2 className="font-display text-2xl font-medium tracking-tight mb-2">
            {otpSent ? 'Verify your email' : (isLogin ? 'Welcome back' : 'Create your account')}
          </h2>
          <p className="text-[#6B6862] text-[15px] mb-6">
            {otpSent 
              ? 'Enter the 6-digit code sent to your inbox.' 
              : (isLogin ? 'Sign in to access your archives.' : 'Set up your account to start exploring the archives.')}
          </p>

          {error && (
            <div role="alert" aria-live="assertive" className="mb-6 p-3 bg-[#F6EAE6] text-[#8C2F2F] text-sm rounded-lg border border-[#8C2F2F]/20 text-left flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {message && (
            <div role="status" aria-live="polite" className="mb-6 p-3 bg-[#E6E2D8]/50 text-[#201F1C] text-sm rounded-lg border border-[#E6E2D8] text-left flex items-start gap-2">
              <Mail className="w-4 h-4 mt-0.5 shrink-0 text-[#6B6862]" />
              <span>{message}</span>
            </div>
          )}

          {/* OTP FORM */}
          {otpSent ? (
            <form onSubmit={handleVerifyOtp} className="space-y-5 text-left">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium mb-2 text-[#201F1C]">One-Time Password (OTP)</label>
                <input 
                  id="otp"
                  type="text" 
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  autoFocus
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full px-4 py-2.5 bg-[#FAF8F4] border border-[#E6E2D8] rounded-lg focus:border-[#201F1C]/40 focus:shadow-sm focus:outline-none transition-all text-center tracking-[0.5em] text-lg font-mono placeholder:text-[#9C988E]"
                  maxLength={6}
                />
              </div>
              <button 
                type="submit" 
                disabled={loading || otp.length < 6}
                className="w-full flex justify-center items-center gap-2 bg-[#201F1C] hover:bg-black text-[#FAF8F4] py-3 rounded-lg text-[15px] font-medium transition-colors disabled:bg-[#9C988E] disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Account'}
              </button>
              <p className="text-center text-[13px] text-[#6B6862]">
                Didn&apos;t get a code?{' '}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || loading}
                  className="font-medium text-[#201F1C] underline underline-offset-4 decoration-[#E6E2D8] hover:decoration-[#201F1C] transition-colors disabled:text-[#9C988E] disabled:cursor-not-allowed disabled:no-underline"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                </button>
              </p>
            </form>
          ) : (
            /* STANDARD AUTH FORM */
            <form onSubmit={handleAuth} className="space-y-4 text-left">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-[#201F1C]">Email address</label>
                <input 
                  id="email"
                  type="email" 
                  autoComplete="email"
                  autoFocus
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 bg-[#FAF8F4] border border-[#E6E2D8] rounded-lg focus:border-[#201F1C]/40 focus:shadow-sm focus:outline-none transition-all text-[15px] placeholder:text-[#9C988E]"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-[#201F1C]">Password</label>
                  {isLogin && (
                    <Link href="/forgot-password" className="text-[13px] text-[#6B6862] hover:text-[#201F1C] transition-colors underline underline-offset-4 decoration-[#E6E2D8] hover:decoration-[#201F1C]">
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <input 
                    id="password"
                    type={showPassword ? "text" : "password"} 
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-11 bg-[#FAF8F4] border border-[#E6E2D8] rounded-lg focus:border-[#201F1C]/40 focus:shadow-sm focus:outline-none transition-all text-[15px] placeholder:text-[#9C988E]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-[#9C988E] hover:text-[#201F1C] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-[#201F1C]">Confirm Password</label>
                  <div className="relative">
                    <input 
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"} 
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 pr-11 bg-[#FAF8F4] border border-[#E6E2D8] rounded-lg focus:border-[#201F1C]/40 focus:shadow-sm focus:outline-none transition-all text-[15px] placeholder:text-[#9C988E]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-[#9C988E] hover:text-[#201F1C] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#6B6862] mt-2 leading-relaxed">
                    Use at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character (!@#$%).
                  </p>
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 bg-[#201F1C] hover:bg-black text-[#FAF8F4] py-3 rounded-lg text-[15px] font-medium transition-colors mt-2 disabled:bg-[#9C988E] disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>
          )}

          {!otpSent && (
            <>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E6E2D8]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-[#6B6862]">Or continue with</span>
                  </div>
                </div>

                <button 
                  onClick={signInWithGoogle}
                  type="button"
                  disabled={loading}
                  className="w-full mt-6 flex justify-center items-center gap-3 bg-white border border-[#E6E2D8] hover:bg-[#FAF8F4] text-[#201F1C] py-2.5 rounded-lg text-[15px] font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    <path d="M1 1h22v22H1z" fill="none"/>
                  </svg>
                  Google
                </button>
              </div>

              <div className="mt-8 text-center">
                <button 
                  onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null); }}
                  className="text-[14px] text-[#6B6862] hover:text-[#201F1C] transition-colors focus:outline-none"
                >
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <span className="font-medium underline underline-offset-4 decoration-[#E6E2D8] hover:decoration-[#201F1C] transition-colors">
                    {isLogin ? "Sign up" : "Sign in"}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}