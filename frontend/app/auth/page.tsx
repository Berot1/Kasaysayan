"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, ShieldCheck, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        
        // Show success message, no OTP required
        setMessage("Account created successfully. Please check your inbox for a verification link.");
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

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background font-sans selection:bg-oxblood selection:text-white overflow-hidden">
      
      {/* Left Column: Branding & Imagery */}
      <div className="hidden md:flex md:w-1/2 lg:w-5/12 bg-charcoal relative flex-col justify-between p-8 overflow-hidden">
        {/* Subtle Map Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://commons.wikimedia.org/wiki/Special:FilePath/Carta%20Hydrographica%20y%20Chorographica%20de%20la%20Yslas%20Filipinas%20MANILA%2C%201734.jpg?width=1000" 
            alt="Historical Map of the Philippines" 
            fill 
            className="object-cover opacity-15 mix-blend-luminosity" 
            unoptimized 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/80 to-transparent"></div>
        </div>

        {/* Top Branding */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg flex items-center justify-center">
              <Image src="/logo2.png" alt="Kasaysayan logo" fill sizes="36px" className="object-cover p-1.5 grayscale brightness-200" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-white">Kasaysayan</span>
          </Link>
        </div>

        {/* Bottom Editorial Content */}
        <div className="relative z-10 max-w-md">
          <p className="text-oxblood-muted text-[10px] font-mono uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Researcher Portal
          </p>
          <h1 className="font-display text-3xl sm:text-4xl leading-[1.1] font-medium text-white mb-4">
            Bring your archives to light.
          </h1>
          <p className="text-stone text-[14px] leading-relaxed">
            Upload and analyze your primary sources. Get reliable answers backed by exact citations from your own historical documents.
          </p>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="flex-1 flex flex-col bg-background h-screen">
        
        {/* Mobile Header & Back Button */}
        <div className="p-5 md:p-6 flex justify-between items-center w-full shrink-0">
          <Link href="/" className="inline-flex items-center gap-2 text-[13px] font-medium text-stone hover:text-charcoal transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <div className="md:hidden relative h-7 w-7 overflow-hidden rounded-lg border border-border-strong bg-white shadow-sm">
             <Image src="/logo2.png" alt="Kasaysayan logo" fill sizes="28px" className="object-cover" />
          </div>
        </div>

        {/* Form Container (Centered, No Scroll) */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:px-12 min-h-0">
          <div className="w-full max-w-[360px]">
            
            <div className="mb-5">
              <h2 className="font-display text-2xl font-medium tracking-tight text-charcoal mb-1">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </h2>
              <p className="text-stone text-[14px]">
                {isLogin ? 'Sign in to access your historical archives.' : 'Create an account to manage your archives.'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-oxblood-muted text-oxblood text-[13px] rounded-lg border border-oxblood/10 text-left flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span className="leading-snug">{error}</span>
              </div>
            )}
            
            {message && (
              <div className="mb-4 p-3 bg-surface text-charcoal text-[13px] rounded-lg border border-border-subtle shadow-sm text-left flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2">
                <Mail className="w-4 h-4 shrink-0 text-stone" />
                <span className="leading-snug">{message}</span>
              </div>
            )}

            <form onSubmit={handleAuth} className="flex flex-col gap-3 text-left">
              <div>
                <label className="block text-[13px] font-medium mb-1 text-charcoal">Email address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="researcher@university.edu"
                  className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg focus:border-charcoal/40 focus:shadow-sm focus:outline-none transition-all text-[14px] text-charcoal placeholder:text-stone"
                />
              </div>
              
              <div>
                <label className="block text-[13px] font-medium mb-1 text-charcoal">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-3 pr-10 py-2 bg-surface border border-border-subtle rounded-lg focus:border-charcoal/40 focus:shadow-sm focus:outline-none transition-all text-[14px] text-charcoal placeholder:text-stone font-mono [&::-ms-reveal]:hidden"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-stone hover:text-charcoal transition-colors focus:outline-none">
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              
              {!isLogin && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-[13px] font-medium mb-1 text-charcoal">Confirm password</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-3 pr-10 py-2 bg-surface border border-border-subtle rounded-lg focus:border-charcoal/40 focus:shadow-sm focus:outline-none transition-all text-[14px] text-charcoal placeholder:text-stone font-mono [&::-ms-reveal]:hidden"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2.5 text-stone hover:text-charcoal transition-colors focus:outline-none">
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {/* Condensed helper text */}
                  <p className="text-[11px] text-stone mt-1.5 leading-tight">
                    Min 8 chars: uppercase, lowercase, number, special char (!@#$%).
                  </p>
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 bg-charcoal hover:bg-black text-white py-2.5 rounded-full text-[14px] font-medium transition-all shadow-sm hover:shadow-md mt-1.5 disabled:bg-stone disabled:shadow-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLogin ? 'Sign in' : 'Create account')}
              </button>
            </form>

            <div className="mt-5">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-subtle"></div>
                </div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-mono">
                  <span className="px-2 bg-background text-stone">Or continue with</span>
                </div>
              </div>

              <button 
                onClick={async () => {
                  setLoading(true);
                  await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: { redirectTo: `${window.location.origin}/dashboard` }
                  });
                }}
                type="button"
                className="w-full mt-4 flex justify-center items-center gap-2.5 bg-surface border border-border-strong hover:bg-muted text-charcoal py-2 rounded-full text-[13px] font-medium transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
            </div>

            <div className="mt-5 text-center">
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null); }}
                className="text-[13px] text-stone hover:text-charcoal transition-colors focus:outline-none"
              >
                {isLogin ? "New to Kasaysayan? " : "Already have an account? "}
                <span className="font-medium underline underline-offset-4 decoration-border-strong hover:decoration-charcoal transition-all">
                  {isLogin ? "Create an account" : "Sign in"}
                </span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}