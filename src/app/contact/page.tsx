"use client";

import { MapPin, Phone, Mail, Send, Sparkles, MessageSquare, ChevronRight } from "lucide-react";
import { FadeIn, ScaleIn } from "@/components/ui/Animations";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1d] pt-32 pb-24 font-sans relative overflow-hidden">
      
      {/* Background aesthetics */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-blue/30 rounded-full blur-[120px] opacity-40 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-gold/5 rounded-full blur-[100px] opacity-20 translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header */}
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h4 className="text-accent-gold font-black uppercase tracking-[0.25em] mb-4 text-[10px] flex items-center justify-center gap-3">
              <Sparkles size={16} /> Elite Support
            </h4>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
              Private <span className="text-accent-gold">Concierge</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed font-medium">
              Whether you are looking to acquire, divest, or simply inquire about our portfolio, our curators are at your absolute disposal.
            </p>
          </div>
        </FadeIn>

        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
          
          {/* Contact Info Sidebar */}
          <div className="lg:w-1/3">
            <FadeIn delay={0.1}>
              <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/10 rounded-bl-full opacity-50 pointer-events-none"></div>
                
                <div>
                  <h3 className="text-3xl font-black text-white mb-6 tracking-tight">Direct Access</h3>
                  <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">
                    Reach out to our global headquarters. Discretion and speed are guaranteed.
                  </p>
                </div>

                <div className="space-y-8 relative z-10">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-accent-gold/10 text-accent-gold rounded-full flex items-center justify-center shrink-0 border border-accent-gold/20">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-white text-xs uppercase tracking-widest mb-2">Global HQ</h4>
                      <p className="text-sm text-slate-400 leading-relaxed font-medium">
                        123 Luxury Avenue, Suite 500<br />
                        Beverly Hills, CA 90210
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-accent-gold/10 text-accent-gold rounded-full flex items-center justify-center shrink-0 border border-accent-gold/20">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-white text-xs uppercase tracking-widest mb-2">Secure Line</h4>
                      <p className="text-sm text-slate-400 font-medium">
                        <a href="tel:+18001234567" className="hover:text-accent-gold transition-colors block mb-1">+1 (800) 123-4567</a>
                        <span className="text-accent-gold/60 text-[10px] font-black uppercase tracking-widest">24/7 Availability</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center shrink-0 border border-emerald-500/20">
                      <MessageSquare size={20} className="animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-black text-white text-xs uppercase tracking-widest mb-2">Digital Concierge</h4>
                      <p className="text-sm text-slate-400 font-medium">
                        <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2">
                          Chat on WhatsApp <ChevronRight size={14} />
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Contact Form */}
          <div className="lg:w-2/3">
            <ScaleIn delay={0.2}>
              <div className="bg-white/5 backdrop-blur-2xl p-10 md:p-14 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden">
                <h3 className="text-3xl font-black text-white mb-10 tracking-tight">Initiate Priority Channel</h3>
                
                <form className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2">First Name</label>
                      <input 
                        type="text" 
                        className="w-full px-6 py-4 bg-primary-blue/50 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold transition-all text-sm font-bold text-white placeholder:text-slate-600 uppercase tracking-widest" 
                        placeholder="JOHN"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2">Last Name</label>
                      <input 
                        type="text" 
                        className="w-full px-6 py-4 bg-primary-blue/50 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold transition-all text-sm font-bold text-white placeholder:text-slate-600 uppercase tracking-widest" 
                        placeholder="DOE"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2">Secure Email</label>
                      <input 
                        type="email" 
                        className="w-full px-6 py-4 bg-primary-blue/50 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold transition-all text-sm font-bold text-white placeholder:text-slate-600 tracking-widest uppercase" 
                        placeholder="JD@DOMAIN.COM"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2">Contact Number</label>
                      <input 
                        type="tel" 
                        className="w-full px-6 py-4 bg-primary-blue/50 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold transition-all text-sm font-bold text-white placeholder:text-slate-600 tracking-widest uppercase" 
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2">Transmission Subject</label>
                    <select className="w-full px-6 py-4 bg-primary-blue/50 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold transition-all text-xs font-black text-white cursor-pointer tracking-widest uppercase appearance-none">
                      <option className="bg-primary-blue" value="">SELECT DIRECTIVE</option>
                      <option className="bg-primary-blue" value="buy">ACQUIRE ASSET</option>
                      <option className="bg-primary-blue" value="sell">DIVEST ASSET</option>
                      <option className="bg-primary-blue" value="general">GENERAL CONSULTATION</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2">Detailed Directive</label>
                    <textarea 
                      rows={5}
                      className="w-full px-6 py-4 bg-primary-blue/50 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold transition-all text-sm font-bold text-white placeholder:text-slate-600 resize-none tracking-widest" 
                      placeholder="ENTER PARAMETERS..."
                    ></textarea>
                  </div>

                  <button 
                    type="button" 
                    className="w-full md:w-auto bg-accent-gold text-white py-5 px-10 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-accent-gold-hover transition-all shadow-xl shadow-accent-gold/20 flex items-center justify-center gap-3 group"
                  >
                    Transmit Directive
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              </div>
            </ScaleIn>
          </div>

        </div>
      </div>
    </div>
  );
}
