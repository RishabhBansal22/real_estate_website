import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building, Home, Sprout, TrendingUp, ShieldCheck, Trophy, Sparkles } from "lucide-react";
import PropertyCard from "@/components/ui/PropertyCard";
import AdvancedSearch from "@/components/ui/AdvancedSearch";
import TopCitiesSection from "@/components/ui/TopCitiesSection";
import ContactCTA from "@/components/ui/ContactCTA";
import connectToDatabase from "@/lib/mongodb";
import Property from "@/models/Property";
import { FadeIn, ScaleIn } from "@/components/ui/Animations";

interface PropertyData {
  id: string;
  title: string;
  city: string;
  locality: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  imageUrl: string;
  highlights: string[];
  amenities: string[];
  nearby: Array<{
    name: string;
    category: string;
    distance: string;
  }>;
  builder: {
    name: string;
    experience: string;
  };
  isVerified: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default async function HomePage() {
  await connectToDatabase();
  // Fetch newest 3 properties for featured section
  const allProperties = await Property.find({}).sort({ createdAt: -1 }).limit(3);
  
  // Next.js requires plain objects from Mongoose for Server Components passing data to Client Components.
  const featuredProperties = allProperties.map(doc => {
    const obj = doc.toJSON();
    obj.id = obj.id.toString();
    return obj;
  });

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">
      {/* Dynamic Hero Section - Luxury Real Estate Theme */}
      <section className="relative min-h-[92vh] flex items-center pt-24 overflow-hidden bg-[#0a0f1d]">
        {/* Luxury Background Accents - Deep Blue & Gold Light Leaks */}
        <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-primary-blue/30 rounded-full blur-[120px] opacity-40 -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-accent-gold/5 rounded-full blur-[100px] opacity-20 translate-y-1/3 -translate-x-1/3"></div>
        <div className="absolute top-[20%] left-[40%] w-[300px] h-[300px] bg-accent-gold/10 rounded-full blur-[80px] opacity-30 animate-pulse"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column: Typography & Search */}
            <FadeIn>
              <div className="max-w-2xl text-white space-y-10">
                <div className="inline-block px-5 py-2.5 bg-accent-gold/10 text-accent-gold font-black rounded-full text-[10px] uppercase tracking-[0.2em] border border-accent-gold/20 shadow-xl shadow-accent-gold/5">
                  <span className="flex items-center gap-2.5"><Trophy size={14} /> The Gold Standard of Living</span>
                </div>
                
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tighter text-white">
                  Invest In <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-gold via-accent-gold-hover to-accent-gold">
                    Pure Luxury
                  </span>
                  <br />& Heritage.
                </h1>
                
                <p className="text-xl text-slate-400 leading-relaxed max-w-lg font-medium">
                  Exclusive smart farm estates and landmark villas designed for those who command the best. Secure your legacy in the most prestigious locations.
                </p>

                {/* Global AI Search Bar (Glassmorphism) */}
                <AdvancedSearch />

                <div className="flex items-center gap-8 pt-6 text-[11px] font-black uppercase tracking-widest text-slate-500">
                  <div className="flex items-center gap-2.5"><ShieldCheck className="text-accent-gold" size={20} /> Landmark Trusted</div>
                  <div className="flex items-center gap-2.5"><TrendingUp className="text-accent-gold" size={20} /> Unrivaled Appreciation</div>
                </div>
              </div>
            </FadeIn>

            {/* Right Column: Premium Imagery */}
            <div className="relative h-[650px] w-full hidden lg:block">
              <ScaleIn delay={0.2}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] h-[95%] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-[8px] border-white/5 z-10">
                  <Image 
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200"
                    alt="Luxury Estate"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-[2000ms] ease-out"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-blue/80 via-transparent to-transparent"></div>
                </div>
              </ScaleIn>

              {/* Floating Stat Card - Dark Theme */}
              <div className="absolute top-[15%] -left-[5%] z-20 bg-primary-blue/80 backdrop-blur-2xl p-6 rounded-[2rem] shadow-2xl border border-white/10 flex items-center gap-5 animate-bounce-slow">
                 <div className="w-14 h-14 bg-accent-gold rounded-full flex items-center justify-center text-white shadow-lg shadow-accent-gold/20">
                    <Sparkles size={24} />
                 </div>
                 <div>
                   <h4 className="text-3xl font-black text-white">100%</h4>
                   <p className="text-[10px] font-black uppercase tracking-[0.15em] text-accent-gold">Global Portfolio</p>
                 </div>
              </div>

              {/* Floating Highlight Card */}
              <div className="absolute bottom-[20%] -right-[5%] z-20 bg-white/95 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border border-white animate-bounce-slow-reverse">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h4 className="text-2xl font-black text-primary-blue">Legacy Plots</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Starting ₹1.5 Cr onwards</p>
                  </div>
                  <span className="bg-primary-blue text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">Heritage</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-gold w-[85%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section Updated to Luxury Theme */}
      <section className="py-24 bg-white text-center relative overflow-hidden border-b border-slate-50">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 opacity-[0.03] text-primary-blue scale-150 rotate-12"><Trophy size={300} /></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <FadeIn>
            <blockquote className="max-w-4xl mx-auto">
              <p className="text-4xl md:text-5xl font-black text-slate-900 mb-10 leading-tight tracking-tight">
                &quot;Don&apos;t wait to buy real estate. Buy real estate and wait.&quot;
              </p>
              <footer className="flex flex-col items-center gap-2">
                <div className="h-px w-20 bg-accent-gold mb-2"></div>
                <span className="text-accent-gold font-black uppercase tracking-[0.3em] text-xs">
                  Will Rogers
                </span>
              </footer>
            </blockquote>
          </FadeIn>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-32 bg-[#f8fafc] relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
            <FadeIn>
              <div className="max-w-xl">
                <h4 className="text-accent-gold font-black uppercase tracking-[0.25em] mb-4 text-[10px] flex items-center gap-3">
                  <Sparkles size={16} /> Curated Collections
                </h4>
                <h2 className="text-5xl md:text-6xl font-black text-primary-blue tracking-tighter">Fine Estates</h2>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <Link href="/properties" className="group flex items-center gap-4 text-primary-blue font-black bg-white px-8 py-4 rounded-full shadow-xl shadow-primary-blue/5 border border-slate-100 hover:border-accent-gold transition-all hover:scale-105 active:scale-95 uppercase text-xs tracking-widest">
                View Collection 
                <span className="bg-primary-blue text-white p-2 rounded-full group-hover:bg-accent-gold transition-colors">
                  <ArrowRight size={16} />
                </span>
              </Link>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProperties.map((property: PropertyData, idx: number) => (
              <FadeIn key={property.id} delay={0.1 * idx}>
                <PropertyCard property={property} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Categories Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-20 max-w-2xl mx-auto">
             <FadeIn>
               <h4 className="text-accent-gold font-black uppercase tracking-[0.25em] mb-4 text-[10px]">Lifestyle Pursuits</h4>
               <h2 className="text-5xl md:text-6xl font-black text-primary-blue mb-8 tracking-tighter">Choose Your Legacy</h2>
               <p className="text-slate-500 text-lg font-medium">An investment in real estate is an investment in your future. Select from our ultra-premium categories.</p>
             </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Apartments", count: "Premium Flats", slug: "apartment", icon: <Building size={40} strokeWidth={1} />, bg: "bg-slate-50", color: "text-primary-blue" },
              { title: "Villas", count: "Independent Houses", slug: "villa", icon: <Home size={40} strokeWidth={1} />, bg: "bg-slate-50", color: "text-primary-blue" },
              { title: "Plots", count: "Residential Land", slug: "plot", icon: <Sprout size={40} strokeWidth={1} />, bg: "bg-slate-50", color: "text-primary-blue" },
              { title: "Commercial", count: "Office Spaces", slug: "commercial", icon: <Trophy size={40} strokeWidth={1} />, bg: "bg-slate-50", color: "text-primary-blue" },
            ].map((cat, idx) => (
              <FadeIn key={idx} delay={0.1 * idx}>
                <Link href={"/properties?type=" + cat.slug} className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-10 text-center hover:border-accent-gold hover:shadow-2xl hover:shadow-primary-blue/5 transition-all duration-500">
                  <div className={`w-24 h-24 mx-auto ${cat.bg} rounded-full flex items-center justify-center ${cat.color} mb-8 group-hover:scale-110 group-hover:bg-primary-blue group-hover:text-white transition-all duration-500 shadow-inner`}>
                    {cat.icon}
                  </div>
                  <h3 className="text-2xl font-black text-primary-blue mb-3">{cat.title}</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{cat.count}</p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Top Cities Section */}
      <TopCitiesSection />

      {/* Contact CTA Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn>
            <ContactCTA />
          </FadeIn>
        </div>
      </section>

      {/* Call to action section */}
      <section className="py-32 bg-primary-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687931-cebf143de805?auto=format&fit=crop&q=80&w=1600')] bg-cover opacity-10 bg-fixed"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <FadeIn>
            <span className="text-accent-gold font-black uppercase tracking-[0.4em] text-xs mb-6 block">Immediate Acquisition</span>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tighter">Your Masterpiece Awaits.</h2>
            <Link href="/contact" className="inline-block bg-accent-gold hover:bg-accent-gold-hover text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-sm shadow-2xl shadow-accent-gold/20 hover:scale-105 active:scale-95 transition-all">
              Consult Our Curators
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
