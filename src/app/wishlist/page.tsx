"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { useState, useEffect, Suspense } from "react";
import { Heart, Home, Search, Sparkles, ArrowRight, BarChart3, ArrowLeft } from "lucide-react";
import PropertyCard from "@/components/ui/PropertyCard";
import { FadeIn, ScaleIn } from "@/components/ui/Animations";
import { useCompare } from "@/hooks/useCompare";

export default function WishlistPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0f1d] flex text-accent-gold font-black uppercase tracking-[0.3em] items-center justify-center">Accessing Private Vault...</div>}>
      <WishlistContent />
    </Suspense>
  );
}

function WishlistContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { compareIds, toggleCompare, clearCompare } = useCompare();

  const [savedProperties, setSavedProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      fetchSavedProperties();
    }
  }, [status, router]);

  const fetchSavedProperties = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/users/wishlist');
      if (res.ok) {
        setSavedProperties(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
    setIsLoading(false);
  };

  const handleCompareAll = () => {
    // Only compare first 4 if list is larger
    const toCompare = savedProperties.slice(0, 4);
    clearCompare();
    toCompare.forEach(p => toggleCompare(p.id));
    router.push('/compare');
  };

  if (status === "loading") {
    return <div className="min-h-screen bg-[#0a0f1d] flex text-accent-gold font-black uppercase tracking-[0.3em] items-center justify-center">Verifying Credentials...</div>;
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#0a0f1d] pt-32 pb-24 font-sans relative overflow-hidden">
      
      {/* Background aesthetics */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-blue/30 rounded-full blur-[120px] opacity-40 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-gold/5 rounded-full blur-[100px] opacity-20 translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header */}
        <FadeIn>
          <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-10">
            <div className="max-w-2xl">
              <Link href="/properties" className="inline-flex items-center gap-2 text-accent-gold font-black text-[10px] uppercase tracking-widest mb-6 hover:translate-x-[-4px] transition-all">
                <ArrowLeft size={14} /> Back to Portfolio
              </Link>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6 italic">
                Your <span className="text-accent-gold font-black uppercase tracking-tighter not-italic">Private</span> Vault
              </h1>
              <p className="text-slate-400 font-medium text-xl leading-relaxed">
                A curated selection of your most desired luxury acquisitions.
              </p>
            </div>
            
            {savedProperties.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                 <button 
                  onClick={handleCompareAll}
                  className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl"
                >
                  <BarChart3 size={16} className="text-accent-gold" /> Analyze Inventory
                </button>
                <div className="w-full sm:w-auto bg-accent-gold text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-accent-gold/20 flex items-center gap-2">
                  <Heart size={16} className="fill-white" /> {savedProperties.length} Retained Assets
                </div>
              </div>
            )}
          </div>
        </FadeIn>

        {/* Content */}
        {isLoading ? (
          <div className="p-24 text-center">
            <div className="text-accent-gold font-black text-xs uppercase tracking-[0.3em] animate-pulse">Syncing with Central Repository...</div>
          </div>
        ) : savedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {savedProperties.map((prop, idx) => (
              <FadeIn key={prop.id} delay={0.1 * idx}>
                <PropertyCard property={prop} />
              </FadeIn>
            ))}
          </div>
        ) : (
          <FadeIn>
            <div className="bg-white/5 backdrop-blur-3xl p-16 md:p-24 rounded-[4rem] border border-white/10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/5 rounded-full blur-[80px] group-hover:bg-accent-gold/10 transition-all duration-1000"></div>
               
               <div className="w-32 h-32 bg-primary-blue/50 rounded-full flex flex-col items-center justify-center text-accent-gold mb-10 border border-white/20 shadow-inner relative z-10">
                  <Heart size={50} className="animate-pulse" />
               </div>
               
               <h3 className="text-4xl font-black text-white mb-6 tracking-tighter relative z-10 italic">Your Collections Are Empty</h3>
               <p className="text-slate-400 font-medium max-w-md mb-12 text-lg leading-relaxed relative z-10">
                 Explore our exclusive inventory and designate your preferred estates for private analysis.
               </p>
               
               <Link href="/properties" className="group relative bg-accent-gold text-white px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-accent-gold/30 hover:scale-105 active:scale-95 transition-all z-10 overflow-hidden">
                  <span className="relative z-10 flex items-center gap-4">
                    Explore Masterpieces <ArrowRight size={18} />
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
               </Link>
            </div>
          </FadeIn>
        )}
      </div>

      {/* Decorative Accents */}
      <div className="fixed bottom-0 left-0 p-10 opacity-10 pointer-events-none">
        <Home size={300} strokeWidth={0.5} className="text-white" />
      </div>
    </div>
  );
}
