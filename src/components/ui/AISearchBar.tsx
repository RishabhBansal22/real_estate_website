"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, Loader2, MapPin, Building, ArrowRight } from "lucide-react";

export default function AISearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions with a simple debounce
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error("Failed to fetch suggestions", err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleAISearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setShowSuggestions(false);
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      if (res.ok) {
        const data = await res.json();
        router.push(data.url);
      } else {
        router.push(`/properties?location=${encodeURIComponent(query)}`);
      }
    } catch (err) {
      router.push(`/properties?location=${encodeURIComponent(query)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion: any) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    router.push(`/properties/${suggestion.id}`);
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl p-3 rounded-2xl shadow-[0_20px_50px_-15px_rgba(15,23,42,0.1)] border border-white/40 relative z-30 group" ref={suggestionsRef}>
      <form onSubmit={handleAISearch} className="flex flex-col md:flex-row gap-2">
        <div className="flex-1 relative flex items-center">
          <div className="absolute left-4 flex items-center gap-1.5">
             <Sparkles size={18} className="text-accent-gold animate-pulse" />
          </div>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
            placeholder="Try: 'Suggest me property under ₹50L in Mumbai' or 'Villa in Delhi'" 
            className="w-full pl-12 pr-4 py-4 bg-white/50 rounded-xl text-slate-800 outline-none focus:ring-2 focus:ring-accent-gold/20 focus:bg-white transition-all font-bold placeholder:text-slate-400 placeholder:font-medium border border-slate-100"
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b border-slate-50">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3">Top Matches</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSuggestion(s)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left group/item border-b border-slate-50 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-primary-blue group-hover/item:bg-accent-gold group-hover/item:text-white transition-colors">
                        {s.type.toLowerCase().includes('land') ? <MapPin size={18} /> : <Building size={18} />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">{s.text}</div>
                        <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">{s.type}</div>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-slate-300 opacity-0 group-hover/item:opacity-100 group-hover/item:text-accent-gold transition-all -translate-x-2 group-hover/item:translate-x-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <button 
          disabled={isLoading}
          type="submit"
          className="bg-primary-blue hover:bg-secondary-blue text-white px-10 py-4 rounded-xl font-black tracking-tight transition-all shadow-lg shadow-primary-blue/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed border-b-2 border-accent-gold"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} strokeWidth={3} />}
          <span>{isLoading ? "Analyzing..." : "AI Search"}</span>
        </button>
      </form>
      
      {/* Help labels */}
      <div className="mt-4 flex flex-wrap gap-2 px-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">Quick Search:</span>
        {['Mumbai', 'Villa', 'Plots', 'Under 50L'].map((tag) => (
           <button 
             key={tag}
             type="button"
             onClick={() => setQuery(tag.includes('Under') ? tag : `Property in ${tag}`)}
             className="text-[10px] bg-white/50 border border-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold hover:bg-accent-gold hover:text-white transition-colors"
           >
             {tag}
           </button>
        ))}
      </div>
    </div>
  );
}
