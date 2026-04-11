"use client";

import { useCompare } from "@/hooks/useCompare";
import { X, ArrowRight, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ComparisonBar() {
  const { compareIds, toggleCompare, clearCompare } = useCompare();
  const [properties, setProperties] = useState<any[]>([]);

  // Fetch only the properties in the compare list
  useEffect(() => {
    if (compareIds.length > 0) {
      // In a real app we might have a specific batch API, 
      // but for now we'll fetch all and filter or just use the IDs if we had the context.
      // Better: Fetch all properties and filter for speed if using mock data.
      fetch('/api/properties')
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                setProperties(data.filter(p => compareIds.includes(p.id)));
            }
        });
    } else {
      setProperties([]);
    }
  }, [compareIds]);

  if (compareIds.length === 0) return null;

  return (
    <div className="fixed bottom-24 lg:bottom-10 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl animate-in slide-in-from-bottom-20 duration-500">
      <div className="bg-[#0a0f1d]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] p-4 lg:p-6 flex flex-col md:flex-row items-center gap-6">
        
        <div className="flex flex-col gap-1 items-center md:items-start shrink-0">
          <div className="flex items-center gap-2 text-accent-gold font-black text-[10px] uppercase tracking-widest">
            <BarChart3 size={14} /> Intelligence Suite
          </div>
          <div className="text-white font-black text-sm tracking-tight">{compareIds.length} Assets Selected</div>
        </div>

        <div className="flex flex-1 items-center gap-3 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {properties.map(prop => (
            <div key={prop.id} className="relative group shrink-0">
              <img 
                src={prop.imageUrl} 
                alt="" 
                className="w-16 h-16 rounded-2xl object-cover border border-white/10 group-hover:border-accent-gold transition-colors shadow-lg"
              />
              <button 
                onClick={() => toggleCompare(prop.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-rose-600 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {Array.from({ length: 4 - compareIds.length }).map((_, i) => (
            <div key={i} className="w-16 h-16 rounded-2xl border-2 border-dashed border-white/5 flex items-center justify-center text-white/5 shrink-0">
               +
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={clearCompare}
            className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white px-4 transition-colors"
          >
            Clear
          </button>
          <Link 
            href="/compare"
            className="bg-accent-gold text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-accent-gold/20 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
          >
            Compare Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
