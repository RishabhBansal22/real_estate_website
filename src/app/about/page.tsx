import Image from "next/image";
import { CheckCircle2, Users, Trophy, Building2, Sparkles } from "lucide-react";
import { FadeIn, ScaleIn } from "@/components/ui/Animations";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1d] pt-32 pb-24 font-sans relative overflow-hidden">
      
      {/* Background aesthetics */}
      <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-primary-blue/30 rounded-full blur-[120px] opacity-40 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-accent-gold/5 rounded-full blur-[100px] opacity-20 translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header Section */}
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h4 className="text-accent-gold font-black uppercase tracking-[0.25em] mb-4 text-[10px] flex items-center justify-center gap-3">
              <Sparkles size={16} /> The Jain Standard
            </h4>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
              Redefining <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-gold via-accent-gold-hover to-accent-gold">Global Luxury</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium leading-relaxed">
              Founded with a vision to provide unparalleled service and exclusive access to the world&apos;s most sought-after properties, Jain Properties sets the benchmark for exceptional real estate experiences.
            </p>
          </div>
        </FadeIn>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <ScaleIn delay={0.2}>
            <div className="relative h-[600px] w-full rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-[8px] border-white/5">
              <Image 
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1200" 
                alt="Jain Properties Office" 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-[2000ms] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-blue/80 via-transparent to-transparent"></div>
            </div>
          </ScaleIn>

          <FadeIn delay={0.3}>
            <div className="space-y-10">
              <div>
                <h4 className="inline-block px-5 py-2.5 bg-accent-gold/10 text-accent-gold font-black rounded-full text-[10px] uppercase tracking-[0.2em] border border-accent-gold/20 mb-6">
                  Our Heritage
                </h4>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">A Legacy of Excellence</h2>
              </div>
              
              <div className="space-y-6 text-slate-400 font-medium text-lg leading-relaxed">
                <p>
                  For over two decades, Jain Properties has been at the forefront of the luxury real estate market. What started as an exclusive boutique agency has grown into a globally recognized brand synonymous with prestige, discretion, and extraordinary results.
                </p>
                <p>
                  We believe that a transaction is not just about buying or selling property; it&apos;s about curating a lifestyle, fulfilling dreams, and building lasting relationships grounded in trust and transparency.
                </p>
              </div>

              <ul className="space-y-5 pt-4">
                {[
                  "Client-First Approach",
                  "Unmatched Market Expertise",
                  "Global Network Reach",
                  "Discreet & Confidential Service"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent-gold/10 flex items-center justify-center text-accent-gold border border-accent-gold/20">
                      <CheckCircle2 size={16} strokeWidth={3} />
                    </div>
                    <span className="font-black text-white text-sm uppercase tracking-widest">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>

        {/* Stats Section */}
        <FadeIn delay={0.4}>
          <div className="bg-white/5 backdrop-blur-2xl rounded-[3.5rem] p-16 border border-white/10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-blue/50 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              {[
                { icon: Users, value: "15k+", label: "Elite Clientele" },
                { icon: Building2, value: "$5B+", label: "Volume Traded" },
                { icon: Trophy, value: "45+", label: "Global Awards" },
                { icon: Users, value: "250+", label: "Master Curators" }
              ].map((stat, idx) => (
                <div key={idx} className="text-center group border-r border-white/10 last:border-0">
                  <div className="flex justify-center text-accent-gold mb-6 group-hover:scale-110 transition-transform duration-500">
                    <stat.icon size={48} strokeWidth={1.5} />
                  </div>
                  <div className="text-5xl font-black text-white mb-3 tracking-tighter">{stat.value}</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

      </div>
    </div>
  );
}
