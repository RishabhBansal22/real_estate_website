"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Building, Home, Coins, ArrowRight } from "lucide-react";
import AISearchBar from "./AISearchBar";

export default function AdvancedSearch() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"standard" | "ai">("standard");

  // Advanced Search State
  const [city, setCity] = useState("Delhi");
  const [locality, setLocality] = useState("");
  const [type, setType] = useState("Apartment");
  const [bhk, setBhk] = useState("Any");
  const [budget, setBudget] = useState("");

  const handleStandardSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (city) queryParams.set("city", city.toLowerCase());
    if (locality) queryParams.set("location", locality.toLowerCase());
    if (type !== "Any") queryParams.set("type", type.toLowerCase());
    if (bhk !== "Any") queryParams.set("beds", bhk);
    if (budget) queryParams.set("budget", budget);
    
    router.push(`/properties?${queryParams.toString()}`);
  };

  return (
    <div className="bg-white/95 backdrop-blur-3xl rounded-[2rem] shadow-2xl overflow-hidden border border-white/20">
      {/* Tabs */}
      <div className="flex bg-slate-50 border-b border-slate-100">
        <button
          onClick={() => setActiveTab("standard")}
          className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-colors ${
            activeTab === "standard"
              ? "bg-white text-primary-blue border-t-2 border-accent-gold"
              : "text-slate-400 hover:bg-white hover:text-primary-blue"
          }`}
        >
          Project Search
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-colors ${
            activeTab === "ai"
              ? "bg-white text-primary-blue border-t-2 border-accent-gold"
              : "text-slate-400 hover:bg-white hover:text-primary-blue"
          }`}
        >
          AI Magic Search
        </button>
      </div>

      <div className="p-6">
        {activeTab === "ai" ? (
          <div className="py-2">
             <AISearchBar />
          </div>
        ) : (
          <form onSubmit={handleStandardSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* City Dropdown */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 focus-within:border-accent-gold focus-within:ring-2 focus-within:ring-accent-gold/20 transition-all">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  <MapPin size={14} className="text-accent-gold" /> City
                </label>
                <select 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  className="w-full bg-transparent text-primary-blue font-bold text-sm outline-none cursor-pointer"
                >
                  <option value="Delhi">Delhi / NCR</option>
                  <option value="Noida">Noida</option>
                  <option value="Gurugram">Gurugram</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Pune">Pune</option>
                  <option value="Bangalore">Bangalore</option>
                </select>
              </div>

              {/* Locality Input */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 focus-within:border-accent-gold focus-within:ring-2 focus-within:ring-accent-gold/20 transition-all">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  <MapPin size={14} className="text-secondary-blue" /> Locality
                </label>
                <input 
                  type="text" 
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Sector 62, Worli"
                  className="w-full bg-transparent text-primary-blue font-bold text-sm outline-none placeholder:text-slate-300"
                />
              </div>

              {/* Type Dropdown */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 focus-within:border-accent-gold focus-within:ring-2 focus-within:ring-accent-gold/20 transition-all">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  <Building size={14} className="text-accent-gold" /> Property
                </label>
                <div className="flex gap-2">
                  <select 
                    value={type} 
                    onChange={(e) => setType(e.target.value)} 
                    className="w-full bg-transparent text-primary-blue font-bold text-sm outline-none cursor-pointer"
                  >
                    <option value="Any">Any Type</option>
                    <option value="Apartment">Apartment / Flat</option>
                    <option value="Villa">Villa / Builder Floor</option>
                    <option value="Plot">Plot / Land</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
              </div>

              {/* Budget/BHK Group for 4th column */}
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100 focus-within:border-accent-gold focus-within:ring-2 focus-within:ring-accent-gold/20 transition-all">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    <Home size={14} className="text-secondary-blue" /> BHK
                  </label>
                  <select 
                    value={bhk} 
                    onChange={(e) => setBhk(e.target.value)} 
                    className="w-full bg-transparent text-primary-blue font-bold text-sm outline-none cursor-pointer"
                    disabled={type === "Plot" || type === "Commercial"}
                  >
                    <option value="Any">Any</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4+ BHK</option>
                  </select>
                </div>
                
                <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100 focus-within:border-accent-gold focus-within:ring-2 focus-within:ring-accent-gold/20 transition-all">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    <Coins size={14} className="text-accent-gold" /> Budget
                  </label>
                  <select 
                    value={budget} 
                    onChange={(e) => setBudget(e.target.value)} 
                    className="w-full bg-transparent text-primary-blue font-bold text-sm outline-none cursor-pointer"
                  >
                    <option value="">Max</option>
                    <option value="5000000">50 Lacs</option>
                    <option value="10000000">1 Crore</option>
                    <option value="50000000">5 Crores</option>
                    <option value="100000000">10 Crores</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-primary-blue hover:bg-secondary-blue text-white py-5 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-primary-blue/20 flex items-center justify-center gap-3 border-b-[3px] border-accent-gold/50 hover:border-accent-gold"
            >
              <Search size={20} />
              Explore Residences
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
