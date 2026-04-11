"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  MapPin, Bed, Bath, Square, Calendar, 
  Check, Heart, Share2, 
  ChevronLeft, ChevronRight, Phone, Mail, 
  MessageCircle, Map as MapIcon, ShieldCheck, 
  CheckCircle2, Zap, CarFront, ArrowUpSquare, 
  GraduationCap, TrainFront, Activity, Building2, Star, TrendingUp, Building
} from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import dynamic from 'next/dynamic';
import { FadeIn } from "@/components/ui/Animations";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { formatIndianCurrency, generateWhatsAppLink } from "@/lib/utils";
import FloatingContactBar from "@/components/ui/FloatingContactBar";

// Dynamically import client-side-only components to avoid SSR issues
const LocationMap = dynamic(() => import('@/components/ui/LocationMap'), { ssr: false, loading: () => <div className="w-full h-96 bg-slate-100 rounded-2xl animate-pulse" /> });
const PriceTrendChart = dynamic(() => import('@/components/ui/PriceTrendChart'), { ssr: false, loading: () => <div className="w-full h-80 bg-slate-100 rounded-2xl animate-pulse" /> });

// Themed Dummy data as fallback 
const FALLBACK_DATA = {
  images: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",
  ],
  description: "A premium legacy asset featuring world-class architecture and strategic urban positioning. Designed for high living and long-term value appreciation, this property offers a seamless blend of luxury and functionality.",
  agent: {
    name: "Michael R.",
    title: "Senior Asset Advisor",
    phone: "+91 70737 19894",
    email: "michael@auraestates.com",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200"
  }
};

export default function PropertyDetailsPage() {
  const { data: session } = useSession();
  const params = useParams();
  
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'message' | 'schedule'>('message'); 
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const idToFind = typeof params?.id === 'string' ? params.id : (params?.id?.[0] || '1');

  useEffect(() => {
    // Fetch Property Info
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => {
        const found = data.find((p: any) => p.id === idToFind || p._id === idToFind) || data[0];
        if (found) {
           setProperty({
             ...found,
             // Fallbacks for UI safety
             description: found.description || FALLBACK_DATA.description,
             images: found.images || (found.imageUrl ? [found.imageUrl, ...FALLBACK_DATA.images] : FALLBACK_DATA.images),
             builder: found.builder || { name: "Elite Developers", experience: "15+ Years" },
             agent: FALLBACK_DATA.agent,
             isVerified: found.isVerified ?? true,
             nearby: found.nearby || [],
             amenities: found.amenities || ["Parking", "Lift", "Security", "Backup"],
             reraNumber: found.reraNumber || 'RERA-PENDING'
           });
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch property details", err);
        setIsLoading(false);
      });

    // Initial Wishlist Check
    if (session?.user) {
      fetch('/api/users/wishlist')
        .then(res => res.json())
        .then((savedItems: any[]) => {
          setIsSaved(savedItems.some((i: any) => i.id === idToFind || i._id === idToFind));
        })
        .catch(() => {});
    }
  }, [idToFind, session]);

  const toggleWishlist = async () => {
    if (!session) {
      signIn();
      return;
    }

    try {
      const res = await fetch('/api/users/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: idToFind })
      });
      if (res.ok) {
        const data = await res.json();
        setIsSaved(data.isSaved);
      }
    } catch (err) {
      console.error("Failed to toggle wishlist", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-16 flex justify-center items-center text-accent-gold font-black uppercase tracking-widest animate-pulse">
        Accessing premium property details...
      </div>
    );
  }

  if (!property) return <div className="min-h-screen pt-32 text-center">Asset not found</div>;

  const nextImage = () => {
    setCurrentImageIdx((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIdx((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const isLand = property.type.toLowerCase().includes('plot') || property.type.toLowerCase().includes('land');
  // Pre-compute cleaned phone — avoids regex inside nested template literals (Turbopack parse error)
  const agentPhone = property.agent.phone.replace(/\s+/g, '');

  return (
    <div className="min-h-screen bg-white pt-24 pb-24 font-sans">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Breadcrumb Navigation */}
        <Breadcrumb />
        
        {/* Top Header - Consolidated */}
        <FadeIn>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="bg-primary-blue text-white text-[10px] font-black px-5 py-2.5 rounded-full uppercase tracking-widest shadow-lg shadow-primary-blue/10">
                  <Star size={14} className="inline mr-2 text-accent-gold" /> Exclusive Portfolio
                </span>
                {property.isVerified && (
                  <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-5 py-2.5 rounded-full border border-emerald-500/20 shadow-sm shadow-emerald-500/10">
                    <CheckCircle2 size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Verified Estate</span>
                  </div>
                )}
                {property.reraNumber && (
                  <div className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full uppercase tracking-widest shadow-sm shadow-slate-900/20">
                    <Building size={16} className="text-accent-gold" />
                    <span className="text-[10px] font-black">RERA: {property.reraNumber}</span>
                  </div>
                )}
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-primary-blue mb-5 tracking-tighter leading-[0.95] uppercase">
                {property.title}
              </h1>
              
              <div className="flex items-center text-slate-500 font-bold text-lg mb-4">
                <MapPin size={22} className="mr-2.5 text-accent-gold shrink-0" />
                <span>{property.locality ? `${property.locality}, ${property.city}` : property.location}</span>
              </div>

              <div className="flex flex-wrap gap-3">
                 <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-5 py-2.5 rounded-xl">
                    {isLand ? `${property.type} in ${property.city}` : `${property.beds}BHK ${property.type}`}
                 </div>
                 {property.highlights?.map((h: string, i: number) => (
                    <div key={i} className="text-[11px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-5 py-2.5 rounded-xl">
                      {h}
                    </div>
                 ))}
              </div>
            </div>
            
            <div className="flex flex-col lg:items-end gap-5 w-full lg:w-auto">
              <div className="text-5xl md:text-7xl font-black text-primary-blue tracking-tighter flex items-center bg-slate-50 px-10 py-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20">
                {formatIndianCurrency(property.price)}
              </div>
              <div className="flex gap-3 w-full lg:w-auto">
                <button className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-800 hover:border-accent-gold hover:text-accent-gold transition-all shadow-xl shadow-slate-200/40">
                  <Share2 size={18} /> Share
                </button>
                <button 
                  onClick={toggleWishlist}
                  className={`flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl ${
                    isSaved 
                      ? "bg-rose-500 border-rose-500 text-white shadow-rose-500/20" 
                      : "bg-white border-slate-100 text-slate-800 hover:border-accent-gold hover:text-accent-gold shadow-slate-200/40"
                  }`}
                >
                  <Heart size={18} className={isSaved ? "fill-white" : ""} /> 
                  {isSaved ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Gallery */}
        <FadeIn delay={0.1}>
          <div className="relative h-[65vh] min-h-[500px] mb-20 rounded-[3.5rem] overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-4 border-white">
            <Image 
              src={property.images[currentImageIdx]} 
              alt={property.title} 
              fill 
              className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110" 
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-blue/60 via-transparent to-transparent pointer-events-none"></div>
            
            <button onClick={prevImage} className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-2xl text-white border border-white/20 p-5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white hover:text-primary-blue shadow-2xl">
              <ChevronLeft size={28} />
            </button>
            <button onClick={nextImage} className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-2xl text-white border border-white/20 p-5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white hover:text-primary-blue shadow-2xl">
              <ChevronRight size={28} />
            </button>
            
            <div className="absolute bottom-10 left-10 flex gap-3">
              {property.images.map((_: any, i: number) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${currentImageIdx === i ? "w-12 bg-accent-gold" : "w-3 bg-white/30"}`} />
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-16">
            
            {/* Stats + Price Breakdown */}
            <div className="space-y-12">
              <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-primary-blue/5 border border-slate-50 grid grid-cols-2 md:grid-cols-4 gap-12">
                <div className="flex flex-col gap-2 border-r border-slate-100 pr-4">
                  <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest italic">Built</span>
                  <span className="text-2xl font-black text-primary-blue flex items-center gap-3">
                    <Calendar size={24} className="text-accent-gold" /> {isLand ? 'N/A' : 'Ready'}
                  </span>
                </div>
                {!isLand && (
                  <div className="flex flex-col gap-2 border-r border-slate-100 pr-4">
                    <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest italic">Configuration</span>
                    <span className="text-2xl font-black text-primary-blue flex items-center gap-3">
                      <Bed size={24} className="text-accent-gold" /> {property.beds} BHK
                    </span>
                  </div>
                )}
                <div className="flex flex-col gap-2 border-r border-slate-100 pr-4">
                  <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest italic">Asset Size</span>
                  <span className="text-2xl font-black text-primary-blue flex items-center gap-3">
                    <Square size={24} className="text-accent-gold" /> {property.sqft.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest italic">Legal Status</span>
                  <span className="text-lg font-black text-emerald-600 flex items-center gap-3">
                    <ShieldCheck size={24} className="text-emerald-500" /> Clear Title
                  </span>
                </div>
              </div>

              {/* Price Transparency Table */}
              <FadeIn>
                <div className="bg-primary-blue text-white rounded-[4rem] p-12 shadow-2xl shadow-primary-blue/30 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/5 rounded-full blur-3xl group-hover:bg-accent-gold/10 transition-all duration-1000"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <h2 className="text-4xl font-black tracking-tighter flex items-center gap-5">
                      <Zap size={32} className="text-accent-gold" /> Estimated Total Ownership
                    </h2>
                    <div className="bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/10 uppercase font-black text-[9px] tracking-widest italic">
                      Transparent Calculations
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] hover:bg-white/10 transition-all">
                      <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-3">Agreement Value</p>
                      <h4 className="text-2xl font-black text-white">{formatIndianCurrency(property.price)}</h4>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] hover:bg-white/10 transition-all">
                      <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-3">Stamp Duty & Reg. (~7%)</p>
                      <h4 className="text-2xl font-black text-white">{formatIndianCurrency(property.price * 0.07)}</h4>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] hover:bg-white/10 transition-all border-dashed border-accent-gold/30">
                      <p className="text-accent-gold text-[9px] font-black uppercase tracking-widest mb-3">Est. Taxes (GST ~5%)</p>
                      <h4 className="text-2xl font-black text-accent-gold">{formatIndianCurrency(property.price * 0.05)}</h4>
                    </div>
                  </div>

                  <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-300 font-black uppercase tracking-[0.2em] text-[10px]">Total Invested Capital (Est.)</span>
                      <span className="text-[10px] text-slate-500 font-bold">*Final costs may vary by state and local laws.</span>
                    </div>
                    <div className="text-5xl font-black text-white tracking-tighter drop-shadow-lg">
                      {formatIndianCurrency(property.price * 1.12)}
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Amenities Section */}
            <FadeIn>
              <div className="bg-slate-50/50 border border-slate-100 p-12 rounded-[4rem] relative">
                <h2 className="text-4xl font-black text-primary-blue mb-12 tracking-tighter">Premier Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                  <div className="bg-white p-8 rounded-[2.5rem] flex flex-col items-center text-center shadow-lg shadow-slate-200/40 group hover:bg-primary-blue transition-all duration-500">
                    <CarFront size={32} className="text-accent-gold mb-4 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-black text-primary-blue group-hover:text-white uppercase tracking-widest">Reserved Parking</span>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] flex flex-col items-center text-center shadow-lg shadow-slate-200/40 group hover:bg-primary-blue transition-all duration-500">
                    <ArrowUpSquare size={32} className="text-accent-gold mb-4 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-black text-primary-blue group-hover:text-white uppercase tracking-widest">High-Speed Lifts</span>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] flex flex-col items-center text-center shadow-lg shadow-slate-200/40 group hover:bg-primary-blue transition-all duration-500">
                    <ShieldCheck size={32} className="text-accent-gold mb-4 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-black text-primary-blue group-hover:text-white uppercase tracking-widest">24/7 Security</span>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] flex flex-col items-center text-center shadow-lg shadow-slate-200/40 group hover:bg-primary-blue transition-all duration-500">
                    <Zap size={32} className="text-accent-gold mb-4 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-black text-primary-blue group-hover:text-white uppercase tracking-widest">Power Backup</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  {property.amenities?.map((a: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-gold" /> {a}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Connectivity Section */}
            {property.nearby?.length > 0 && (
              <FadeIn>
                <div>
                  <h2 className="text-4xl font-black text-primary-blue mb-10 tracking-tighter">Connectivity & Perks</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {property.nearby.map((n: any, i: number) => {
                      let Icon = MapPin;
                      if (n.category === 'School') Icon = GraduationCap;
                      if (n.category === 'Metro') Icon = TrainFront;
                      if (n.category === 'Hospital') Icon = Activity;
                      return (
                        <div key={i} className="bg-white border-2 border-slate-50 p-8 rounded-[3rem] shadow-xl shadow-slate-200/20 group hover:border-accent-gold/30 transition-all">
                          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-accent-gold group-hover:bg-accent-gold group-hover:text-white transition-all">
                            <Icon size={28} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">{n.category}</span>
                          <h4 className="text-lg font-black text-primary-blue mb-2">{n.name}</h4>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">• {n.distance} Drive</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Builder Insight */}
            <FadeIn>
              <div className="bg-slate-900 text-white p-12 md:p-16 rounded-[4rem] relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent-gold/20 transition-all duration-1000" />
                 
                 <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                   <div className="w-48 h-48 bg-white/5 border border-white/10 rounded-[3rem] flex flex-col items-center justify-center p-8 backdrop-blur-md">
                      <Building2 size={64} className="text-accent-gold mb-3" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Master Brand</span>
                   </div>
                   <div className="flex-1 text-center md:text-left">
                      <span className="text-accent-gold text-[10px] font-black uppercase tracking-[0.2em] mb-4 block underline underline-offset-8">Vetted Partner</span>
                      <h2 className="text-5xl font-black tracking-tighter mb-6 uppercase leading-tight">{property.builder.name}</h2>
                      <p className="text-slate-400 font-medium text-xl leading-relaxed max-w-2xl mb-10">
                        Pioneering Indian Real Estate with <span className="text-white font-bold">{property.builder.experience} of legacies</span>. Their portfolio stands as a testament to surgical precision and architectural grandeur.
                      </p>
                      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                         <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-emerald-500" />
                           <span className="text-[10px] font-black uppercase tracking-widest">ISO Certified</span>
                         </div>
                         <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-emerald-500" />
                           <span className="text-[10px] font-black uppercase tracking-widest">RERA Registered</span>
                         </div>
                      </div>
                   </div>
                 </div>
              </div>
            </FadeIn>

            {/* Narrative */}
            <FadeIn>
              <div>
                <h2 className="text-4xl font-black text-primary-blue mb-10 tracking-tighter">Narrative</h2>
                <div className="bg-slate-50 border border-slate-100 p-12 rounded-[3.5rem] relative">
                  <p className="text-slate-600 leading-relaxed font-bold text-xl md:text-2xl relative z-10 italic">
                    "{property.description}"
                  </p>
                  <Building size={200} className="absolute -bottom-10 -right-10 text-primary-blue/5 pointer-events-none" />
                </div>
              </div>
            </FadeIn>

            {/* Intelligence & Topography */}
            <div className="grid grid-cols-1 gap-20">
              <FadeIn>
                <div className="bg-white p-12 rounded-[4rem] border border-slate-50 shadow-2xl shadow-slate-200/30">
                  <h2 className="text-3xl font-black text-primary-blue mb-10 tracking-tighter flex items-center gap-4">
                    <TrendingUp size={36} className="text-accent-gold" /> Value Analytics
                  </h2>
                  <PriceTrendChart propertyTitle={property.title} />
                </div>
              </FadeIn>
              <FadeIn>
                <div className="bg-white p-3 rounded-[4rem] border border-slate-50 shadow-2xl shadow-slate-200/30 overflow-hidden">
                  <LocationMap locationName={property.location} />
                </div>
              </FadeIn>
            </div>
            
          </div>

          {/* Right Sidebar */}
          <div className="space-y-10">
            <FadeIn delay={0.2}>
              <div className="bg-white p-1 rounded-[3.5rem] shadow-2xl shadow-primary-blue/10 border border-slate-100 sticky top-28 overflow-hidden">
                <div className="bg-primary-blue p-10 rounded-[2.8rem] flex flex-col items-center text-center relative overflow-hidden group">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1512914890251-2f96a9b0bbe2?auto=format&fit=crop&q=80&w=800')] bg-cover group-hover:scale-110 transition-transform duration-[3000ms]" />
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-[6px] border-white/10 shadow-2xl mb-6 z-10 bg-slate-800">
                    <Image src={property.agent.image} alt={property.agent.name} fill className="object-cover" />
                  </div>
                  <h3 className="font-black text-white text-2xl z-10 tracking-tight">{property.agent.name}</h3>
                  <p className="text-accent-gold text-[10px] font-black uppercase tracking-[0.2em] z-10 mb-8">{property.agent.title}</p>
                  
                  <button onClick={() => requireAuth(() => alert("Connecting to Aura Concierge..."))} className="w-full bg-primary-blue text-white py-5 px-6 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all shadow-2xl shadow-primary-blue/20 flex items-center justify-center gap-3 z-10 active:scale-95 mb-3 border border-white/10">
                    <ShieldCheck size={20} className="text-accent-gold" /> Secure Consultation
                  </button>

                  <div className="grid grid-cols-2 gap-3 z-10 relative">
                    <a 
                      href={`tel:${property.agent.phone}`}
                      className="bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 border border-white/10 transition-all"
                    >
                      <Phone size={14} className="text-accent-gold" /> Call
                    </a>
                    <a 
                      href={generateWhatsAppLink(property.agent.phone, property.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 py-4 rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 border border-emerald-500/30 transition-all"
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex bg-slate-50 p-1.5 rounded-2xl mb-8 border border-slate-100">
                    <button onClick={() => setActiveTab('message')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'message' ? 'bg-white text-primary-blue shadow-lg' : 'text-slate-400'}`}>Message</button>
                    <button onClick={() => setActiveTab('schedule')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'schedule' ? 'bg-white text-primary-blue shadow-lg' : 'text-slate-400'}`}>Viewing</button>
                  </div>

                  {activeTab === 'message' && (
                    <div className="space-y-6">
                      {formSubmitted ? (
                        <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2rem] text-center animate-in zoom-in duration-500">
                           <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                             <Check size={32} />
                           </div>
                           <h4 className="text-xl font-black text-emerald-600 mb-2">Inquiry Logged</h4>
                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed mb-6">Your parameters have been transmitted to the concierge.</p>
                           <a 
                             href={generateWhatsAppLink(property.agent.phone, `I just submitted an enquiry for ${property.title}.`)}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-600 underline underline-offset-4"
                           >
                             Chat on WhatsApp Now
                           </a>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-accent-gold shadow-md"><Phone size={20} /></div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Line</span>
                              <span className="font-black text-primary-blue">{property.agent.phone}</span>
                            </div>
                          </div>
                          <form className="space-y-4">
                            <input type="text" placeholder="Name" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm focus:outline-none focus:ring-4 focus:ring-accent-gold/10" />
                            <textarea rows={4} placeholder="Your requirements..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm focus:outline-none focus:ring-4 focus:ring-accent-gold/10 resize-none" />
                            <button 
                              type="button" 
                              onClick={() => requireAuth(() => setFormSubmitted(true))} 
                              className="w-full bg-primary-blue text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-black transition-all shadow-xl"
                            >
                              Initiate Request
                            </button>
                          </form>
                        </>
                      )}
                    </div>
                  )}
                  
                  {activeTab === 'schedule' && (
                    <div className="space-y-6">
                      <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex items-center gap-4">
                         <Calendar size={28} className="text-emerald-500" />
                         <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest leading-tight">Priority slots available for physical walkthroughs.</span>
                      </div>
                      <input type="date" className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl font-black text-slate-800 text-xs uppercase" />
                      <button type="button" onClick={() => requireAuth(() => alert("Viewing Scheduled"))} className="w-full bg-primary-blue text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-black transition-all shadow-xl">Reserve Slot</button>
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>
          </div>

        </div>
      </div>
      
      {/* Floating Lead Generation Bar (Mobile Only) */}
      <FloatingContactBar 
        phone={property.agent.phone} 
        propertyTitle={property.title} 
        city={property.city} 
      />
    </div>
  );

  function requireAuth(action: () => void) {
    if (!session) {
      signIn();
    } else {
      action();
    }
  }
}
