"use client";

import { Phone, MessageSquare, ChevronRight } from "lucide-react";

interface FloatingContactBarProps {
  phone: string;
  propertyTitle: string;
  city: string;
}

export default function FloatingContactBar({ phone, propertyTitle, city }: FloatingContactBarProps) {
  const whatsappMessage = encodeURIComponent("Hi Aura Estates, I'm interested in " + propertyTitle + " in " + city + ". Please share more details.");
  // Pre-compute cleaned phone to avoid regex inside template literal (Turbopack parse bug)
  const cleanPhone = phone.split(' ').join('').split('+').join('');
  const whatsappUrl = "https://wa.me/" + cleanPhone + "?text=" + whatsappMessage;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-full duration-700">
      <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.2)] p-3 flex gap-3">
        
        {/* Call Button */}
        <a 
          href={`tel:${phone}`}
          className="flex-1 bg-primary-blue text-white flex items-center justify-center gap-3 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-transform"
        >
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
            <Phone size={16} />
          </div>
          Call Now
        </a>

        {/* WhatsApp Button */}
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-emerald-500 text-white flex items-center justify-center gap-3 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-transform shadow-lg shadow-emerald-500/20"
        >
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center animate-pulse">
            <MessageSquare size={16} />
          </div>
          WhatsApp
        </a>

        {/* Quick Enquire - Small Arrow */}
        <button className="w-14 bg-white/10 border border-white/10 text-white flex items-center justify-center rounded-2xl hover:bg-white/20 transition-all">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
