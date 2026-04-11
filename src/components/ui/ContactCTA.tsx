"use client";

import { Phone, MessageSquare, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CONTACT_PHONE_TEL, buildWhatsAppUrl } from "@/lib/contactConfig";

export default function ContactCTA() {
  return (
    <div className="bg-gradient-to-r from-primary-blue via-primary-blue/95 to-accent-gold/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary-blue/20 border border-white/5 backdrop-blur-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        
        {/* Left: Text */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <Zap size={24} className="text-accent-gold animate-pulse" />
            <h3 className="text-2xl font-black text-white tracking-tight">Ready to Invest?</h3>
          </div>
          <p className="text-white/80 text-sm font-bold leading-relaxed">
            Get expert guidance from our luxury concierge team. Same-day response & personalized property matching.
          </p>
        </div>

        {/* Middle: Quick Contact Buttons */}
        <div className="md:col-span-1 flex gap-4 justify-center">
          <a 
            href={CONTACT_PHONE_TEL ? `tel:${CONTACT_PHONE_TEL}` : "#"}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-primary-blue px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-accent-gold hover:text-white transition-all shadow-lg hover:-translate-y-1"
          >
            <Phone size={18} />
            Call Now
          </a>
          <a 
            href={buildWhatsAppUrl("Hi Aura Estates, I need property guidance.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-all shadow-lg hover:-translate-y-1"
          >
            <MessageSquare size={18} />
            WhatsApp
          </a>
        </div>

        {/* Right: Learn More Link */}
        <div className="md:col-span-1 flex justify-end">
          <Link 
            href="/contact"
            className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
          >
            Full Inquiry
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
