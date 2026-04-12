"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Home, KeyRound, Mail, User, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { FadeIn, ScaleIn } from "@/components/ui/Animations";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "An issue occurred during authorization.");
        return;
      }

      setIsSuccess(true);
      
      // Auto-login after successful registration
      setTimeout(async () => {
        const signInRes = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (!signInRes?.error) {
          router.push("/dashboard");
          router.refresh();
        }
      }, 1500);
      
    } catch (err) {
      setError("An unexpected secure error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-gold/10 rounded-full blur-[100px] pointer-events-none"></div>
        <ScaleIn>
          <div className="max-w-md w-full text-center space-y-8 p-12 bg-white/5 backdrop-blur-xl shadow-2xl shadow-accent-gold/10 rounded-[3rem] border border-white/10 relative z-10">
             <div className="w-24 h-24 bg-accent-gold/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-accent-gold/30">
               <ShieldCheck className="h-12 w-12 text-accent-gold animate-bounce-slow" />
             </div>
             <h2 className="text-4xl font-black text-white tracking-tighter">Access Granted</h2>
             <p className="text-accent-gold font-black uppercase tracking-widest text-[10px]">Establishing secure connection to your dashboard...</p>
          </div>
        </ScaleIn>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1d] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      {/* Background aesthetics */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary-blue rounded-full blur-[120px] opacity-60 -translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent-gold/5 rounded-full blur-[100px] opacity-20 translate-y-1/3 translate-x-1/3 pointer-events-none"></div>

      <FadeIn>
        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="flex justify-center mb-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-white/10 backdrop-blur-md text-white p-3.5 rounded-xl group-hover:bg-accent-gold group-hover:text-white transition-all duration-500 border border-white/20 group-hover:border-accent-gold shadow-2xl">
                <Home size={28} />
              </div>
              <span className="font-black text-3xl tracking-tight text-white group-hover:text-accent-gold transition-colors duration-500">
                Jain<span className="text-accent-gold group-hover:text-white transition-colors duration-500">Properties</span>
              </span>
            </Link>
          </div>
          
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-white tracking-tighter mb-4">
              Request Access
            </h2>
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">
              Or{" "}
              <Link href="/login" className="text-accent-gold hover:text-white transition-colors">
                authenticate existing identity
              </Link>
            </p>
          </div>
        </div>
      </FadeIn>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <FadeIn delay={0.1}>
          <div className="bg-white/5 backdrop-blur-2xl py-12 px-6 sm:px-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] sm:rounded-[2.5rem] border border-white/10 relative overflow-hidden group">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/10 rounded-bl-full opacity-50 pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
            
            {error && (
              <div className="mb-8 bg-rose-500/10 border-l-2 border-rose-500 p-4 flex items-start gap-3 relative z-10">
                <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={18} />
                <p className="text-xs font-bold uppercase tracking-widest text-rose-500 leading-relaxed">{error}</p>
              </div>
            )}

            <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">
                  Distinguished Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-accent-gold/70" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-14 pr-5 py-4 bg-primary-blue/50 border border-white/10 rounded-2xl font-bold focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold focus:bg-primary-blue transition-all text-sm text-white outline-none placeholder:text-slate-600 uppercase tracking-widest"
                    placeholder="JOHN SMITH"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">
                  Secure Identity (Email)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-accent-gold/70" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-14 pr-5 py-4 bg-primary-blue/50 border border-white/10 rounded-2xl font-bold focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold focus:bg-primary-blue transition-all text-sm text-white outline-none placeholder:text-slate-600 uppercase tracking-widest"
                    placeholder="IDENTITY@DOMAIN.COM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">
                  Access Key (Password)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-accent-gold/70" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-14 pr-5 py-4 bg-primary-blue/50 border border-white/10 rounded-2xl font-bold focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold focus:bg-primary-blue transition-all text-sm text-white outline-none placeholder:text-slate-600 tracking-widest"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-accent-gold text-white py-5 px-6 rounded-2xl font-black hover:bg-accent-gold-hover transition-all shadow-xl shadow-accent-gold/20 disabled:opacity-50 disabled:cursor-not-allowed group/btn uppercase tracking-widest text-xs"
                >
                  {isLoading ? "Generating credentials..." : "Initialize Access"}
                  {!isLoading && <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />}
                </button>
              </div>
            </form>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
