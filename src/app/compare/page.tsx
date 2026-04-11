"use client";

import { useCompare } from "@/hooks/useCompare";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { 
  X, Check, ArrowLeft, Home, MapPin, 
  Bed, Bath, Square, Building2, Star, 
  MessageSquare, Phone, ShieldCheck 
} from "lucide-react";
import { formatIndianCurrency } from "@/lib/utils";
import { FadeIn } from "@/components/ui/Animations";
import { buildWhatsAppUrl } from "@/lib/contactConfig";

export default function ComparePage() {
  const { compareIds, toggleCompare, clearCompare } = useCompare();
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProperties(data.filter(p => compareIds.includes(p.id)));
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [compareIds]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center">
        <div className="text-accent-gold font-black uppercase tracking-[0.3em] animate-pulse">Analyzing Asset Variables...</div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] pt-32 pb-24 font-sans text-center">
        <div className="container mx-auto px-4 box-border">
          <FadeIn>
            <div className="max-w-xl mx-auto bg-white/5 backdrop-blur-2xl p-16 rounded-[4rem] border border-white/10 shadow-2xl">
               <div className="w-24 h-24 bg-primary-blue rounded-full flex items-center justify-center text-accent-gold mx-auto mb-10 shadow-xl">
                 <Home size={40} />
               </div>
               <h2 className="text-4xl font-black text-white mb-6 tracking-tighter">Portfolio Selection Empty</h2>
               <p className="text-slate-400 font-medium text-lg leading-relaxed mb-10">Select up to 4 assets from our luxury inventory to begin a side-by-side analysis.</p>
               <Link href="/properties" className="inline-flex bg-accent-gold text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all shadow-xl shadow-accent-gold/20">
                 Explore Inventory
               </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1d] pt-32 pb-24 font-sans">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <Link href="/properties" className="inline-flex items-center gap-2 text-accent-gold font-black text-[10px] uppercase tracking-widest mb-6 hover:translate-x-[-4px] transition-transform">
                <ArrowLeft size={14} /> Back to Portfolio
              </Link>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-4">
                Asset <span className="text-accent-gold">Analysis</span>
              </h1>
              <p className="text-slate-400 font-medium text-lg max-w-xl">Deep matrix evaluation of your selected luxury acquisitions.</p>
            </div>
            <button 
              onClick={clearCompare}
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-rose-500 transition-all shadow-xl"
            >
              Flush All
            </button>
          </div>
        </FadeIn>

        {/* Comparison Matrix Table */}
        <div className="relative overflow-x-auto rounded-[3.5rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-primary-blue/30">
                <th className="p-10 w-64 shrink-0 border-b border-white/5">
                  <div className="text-[10px] font-black text-accent-gold uppercase tracking-[0.3em]">Variable</div>
                </th>
                {properties.map(prop => (
                  <th key={prop.id} className="p-10 border-l border-white/5 border-b">
                    <div className="relative group mb-6">
                      <img src={prop.imageUrl} alt="" className="w-full h-48 object-cover rounded-[2rem] border border-white/10 shadow-xl group-hover:scale-105 transition-transform duration-500" />
                      <button 
                        onClick={() => toggleCompare(prop.id)}
                        className="absolute -top-3 -right-3 w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <div className="text-xl font-black text-white mb-2 line-clamp-1">{prop.title}</div>
                    <div className="text-accent-gold font-black text-2xl">{formatIndianCurrency(prop.price)}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-slate-300">
              
              {/* Location */}
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-8 px-10 font-black text-[10px] uppercase tracking-widest text-slate-500">Geography</td>
                {properties.map(p => (
                  <td key={p.id} className="p-8 border-l border-white/5 border-b border-white/5">
                    <div className="flex items-center gap-3 font-bold text-sm">
                      <MapPin size={16} className="text-accent-gold" /> {p.city}, {p.locality}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Class */}
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-8 px-10 font-black text-[10px] uppercase tracking-widest text-slate-500">Asset Class</td>
                {properties.map(p => (
                  <td key={p.id} className="p-8 border-l border-white/5 border-b border-white/5">
                    <span className="bg-white/10 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white border border-white/10">{p.type}</span>
                  </td>
                ))}
              </tr>

              {/* Specs */}
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-8 px-10 font-black text-[10px] uppercase tracking-widest text-slate-500">Configuration</td>
                {properties.map(p => (
                  <td key={p.id} className="p-8 border-l border-white/5 border-b border-white/5 space-y-3">
                    <div className="flex items-center gap-3 font-bold text-sm">
                      <Bed size={16} className="text-primary-blue" /> {p.beds} BHK
                    </div>
                    <div className="flex items-center gap-3 font-bold text-sm">
                      <Square size={16} className="text-primary-blue" /> {p.sqft} SQFT
                    </div>
                  </td>
                ))}
              </tr>

              {/* Status */}
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-8 px-10 font-black text-[10px] uppercase tracking-widest text-slate-500">Authorization</td>
                {properties.map(p => (
                  <td key={p.id} className="p-8 border-l border-white/5 border-b border-white/5">
                    {p.isVerified ? (
                      <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest">
                        <Check size={16} /> Aura Verified
                      </div>
                    ) : (
                      <div className="text-slate-500 font-black text-[10px] uppercase tracking-widest">Verification Pending</div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Builder */}
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-8 px-10 font-black text-[10px] uppercase tracking-widest text-slate-500">Builder Insight</td>
                {properties.map(p => (
                  <td key={p.id} className="p-8 border-l border-white/5 border-b border-white/5">
                    <div className="flex items-center gap-3 font-bold text-sm">
                      <Building2 size={16} className="text-accent-gold" /> {p.builder?.name || "Premium Guild"}
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase mt-1 ml-7">{p.builder?.experience || "15+ Years"} Legacy</div>
                  </td>
                ))}
              </tr>

              {/* Quick Actions */}
              <tr className="bg-primary-blue/20">
                <td className="p-10 px-10"></td>
                {properties.map(p => (
                  <td key={p.id} className="p-10 border-l border-white/5">
                    <div className="flex flex-col gap-4">
                      <Link 
                        href={`/properties/${p.id}`}
                        className="bg-white text-primary-blue py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-center hover:bg-accent-gold hover:text-white transition-all shadow-xl"
                      >
                        Deep Inspect
                      </Link>
                      <a 
                         href={buildWhatsAppUrl(`Hi, I'm analyzing ${p.title} in the Compare tool. Please share pricing.`)}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="bg-emerald-500 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-center flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/10"
                      >
                         <MessageSquare size={14} /> WhatsApp 
                      </a>
                    </div>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>

        {/* Info Alert */}
        <div className="mt-16 bg-accent-gold/5 border border-accent-gold/20 p-8 rounded-[2.5rem] flex items-center gap-6 max-w-4xl mx-auto">
           <ShieldCheck size={40} className="text-accent-gold shrink-0" />
           <p className="text-slate-400 text-sm font-medium leading-relaxed">
             Our <span className="text-white font-black">Investment Analysis Matrix</span> utilizes real-time market volatility data. Prices subject to localized market dynamics.
           </p>
        </div>

      </div>
    </div>
  );
}
