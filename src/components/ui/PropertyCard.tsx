"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Square, Heart, Sprout, MessageSquare, Calculator, Zap, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

import { useSession, signIn } from "next-auth/react";

import { formatIndianCurrency, generateWhatsAppLink } from "@/lib/utils";
import { useCompare } from "@/hooks/useCompare";

interface PropertyProps {
  id: string;
  title: string;
  price: number;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  imageUrl: string;
  type: string;
  status?: string;
  reraNumber?: string;
  createdAt?: string;
  city?: string;
  locality?: string;
  highlights?: string[];
  isVerified?: boolean;
}

export default function PropertyCard({ property }: { property: PropertyProps }) {
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(false);
  const { isInCompare, toggleCompare } = useCompare();

  useEffect(() => {
    if (session?.user) {
      fetch('/api/users/wishlist')
        .then(res => res.json())
        .then((savedItems: { id: string }[]) => {
          setIsSaved(savedItems.some((i: { id: string }) => i.id === property.id));
        })
        .catch(() => {});
    }
  }, [session, property.id]);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      signIn();
      return;
    }

    try {
      const res = await fetch('/api/users/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: property.id })
      });
      if (res.ok) {
        const data = await res.json();
        setIsSaved(data.isSaved);
      }
    } catch (err) {
      console.error("Failed to toggle wishlist", err);
    }
  };

  const isLand = property.type.toLowerCase().includes('land') || property.type.toLowerCase().includes('plot');
  const tagBadges = property.highlights?.filter((h) => h === 'Hot Deal' || h === 'New') || [];
  const isHotDeal = tagBadges.includes('Hot Deal');
  const isNew = tagBadges.includes('New');
  const cityLabel = property.city || property.location?.split(',').pop()?.trim() || property.location;
  const summaryString = !isLand 
    ? `${property.beds}BHK ${property.type} in ${cityLabel} | ${formatIndianCurrency(property.price)} | ${property.sqft} sqft`
    : `${property.type} in ${cityLabel} | ${formatIndianCurrency(property.price)} | ${property.sqft} sq. yds`;

  return (
    <div className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-primary-blue/10 transition-all duration-500 transform hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src={property.imageUrl}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-blue/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Badges */}
        <div className="absolute top-5 left-5 flex flex-wrap items-start gap-2">
           <div className="bg-accent-gold text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
             Exclusive
           </div>
           <div className="bg-white/95 backdrop-blur-sm text-primary-blue text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
             {property.type}
           </div>
           {isHotDeal && (
             <div className="bg-rose-500 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-2">
               <Zap size={12} /> Hot Deal
             </div>
           )}
           {isNew && (
             <div className="bg-emerald-500 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-2">
               <Sparkles size={12} /> New
             </div>
           )}
           {property.isVerified && (
             <div className="flex items-center gap-2 bg-emerald-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg self-start border border-emerald-400">
               <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
               Verified
             </div>
           )}
           {property.status && (
             <div className={`flex items-center gap-2 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg self-start border ${
               property.status === 'Ready to Move' 
                 ? 'bg-emerald-500 text-white border-emerald-400' 
                 : 'bg-amber-500 text-white border-amber-400'
             }`}>
               <span className={`w-1.5 h-1.5 rounded-full ${
                 property.status === 'Ready to Move' ? 'bg-white animate-pulse' : 'bg-white'
               }`}></span>
               {property.status}
             </div>
           )}
        </div>
        
        {/* Save Button */}
        <button 
          onClick={handleSave}
          className="absolute top-5 right-5 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-white transition-all z-10 hover:scale-110 active:scale-90"
        >
           <Heart 
             size={20} 
             className={`transition-colors ${isSaved ? "fill-accent-gold text-accent-gold" : "text-slate-400 group-hover:text-primary-blue"}`} 
           />
        </button>

        {/* WhatsApp Quick Link */}
        <a 
          href={generateWhatsAppLink("917073719894", property.title)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="absolute top-20 right-5 bg-emerald-500 text-white p-3 rounded-full shadow-lg hover:bg-emerald-600 transition-all z-10 hover:scale-110 active:scale-90"
        >
           <MessageSquare size={20} />
        </a>
      </div>

      {/* Content */}
      <div className="p-8 relative">
        {/* Animated accent bar on hover */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-1.5 bg-accent-gold opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-b-full shadow-[0_4px_15px_rgba(194,155,64,0.4)]"></div>

        <div className="flex flex-col gap-2 mb-4">
          <div className="text-3xl font-black text-primary-blue tracking-tighter">
            {formatIndianCurrency(property.price)}
          </div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
             {summaryString}
          </div>
          {property.reraNumber && (
            <div className="mt-3 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
              RERA: <span className="text-primary-blue">{property.reraNumber}</span>
            </div>
          )}
        </div>
        
        <Link href={`/properties/${property.id}`}>
          <h3 className="text-2xl font-bold text-slate-800 mb-2 hover:text-accent-gold transition-colors line-clamp-1 leading-tight">
            {property.title}
          </h3>
        </Link>
        <div className="flex items-center text-slate-500 mb-6 text-sm font-semibold tracking-wide">
          <MapPin size={16} className="mr-2 text-accent-gold shrink-0" />
           <span className="line-clamp-1">{property.locality ? `${property.locality}, ${property.city}` : property.location}</span>
        </div>

        {/* Highlights Tags */}
        {property.highlights && property.highlights.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {property.highlights.slice(0, 3).map((h, i) => (
              <span key={i} className="text-[9px] font-black uppercase tracking-widest bg-accent-gold/5 text-accent-gold border border-accent-gold/10 px-2.5 py-1 rounded-md">
                • {h}
              </span>
            ))}
          </div>
        )}

        {/* Features Divider */}
        <div className="h-[2px] bg-slate-50 mb-6 w-full group-hover:bg-accent-gold/10 transition-colors"></div>

        {/* Features - Conditional for Land vs Built */}
        <div className="flex items-center justify-between text-slate-600 text-[13px] font-bold uppercase tracking-widest">
          {(!isLand && property.beds > 0) ? (
            <>
              <div className="flex items-center gap-2">
                <Bed size={18} className="text-primary-blue" />
                <span>{property.beds} <span className="text-[10px] text-slate-400">BHK</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Bath size={18} className="text-primary-blue" />
                <span>{property.baths} <span className="text-[10px] text-slate-400">Baths</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Square size={18} className="text-primary-blue" />
                <span>{property.sqft.toLocaleString()} <span className="text-[10px] text-slate-400">sqft</span></span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-accent-gold">
                <Sprout size={18} className="text-accent-gold" />
                <span>Premium Plot</span>
              </div>
              <div className="flex items-center gap-2">
                <Square size={18} className="text-primary-blue" />
                <span>{property.sqft.toLocaleString()} <span className="text-[10px] text-slate-400">sq. yds</span></span>
              </div>
            </>
          )}
        </div>

        {/* Comparison Toggle */}
        <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
             <Link 
               href={`/emi-calculator?price=${property.price}&downPayment=${Math.round(property.price * 0.2)}`}
               className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent-gold hover:text-accent-gold-hover transition-colors"
             >
               <Calculator size={12} />
               EMI Calculator
             </Link>
             <button 
               onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleCompare(property.id); }}
               className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                 isInCompare(property.id) 
                   ? "bg-accent-gold/10 border-accent-gold text-accent-gold shadow-lg shadow-accent-gold/5" 
                   : "bg-slate-50 border-slate-100 text-slate-400 hover:border-accent-gold/30 hover:text-accent-gold/60"
               }`}
             >
               <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-colors ${isInCompare(property.id) ? "bg-accent-gold border-accent-gold text-white" : "bg-white border-slate-200"}`}>
                 {isInCompare(property.id) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest">Compare Item</span>
             </button>
        </div>
      </div>
    </div>
  );
}
