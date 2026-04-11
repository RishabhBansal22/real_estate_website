"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";

export default function FloatingWhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  
  const defaultPhone = "917073719894"; // Admin WhatsApp number
  const defaultMessage = "Hi, I'm interested in your property!";

  return (
    <>
      {/* Floating Button */}
      <a
        href={`https://wa.me/${defaultPhone}?text=${encodeURIComponent(defaultMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl shadow-emerald-500/50 hover:scale-110 transition-all active:scale-95 cursor-pointer group"
        title="Chat on WhatsApp"
      >
        <MessageCircle size={28} />
        <span className="absolute bottom-1/2 right-20 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat on WhatsApp
        </span>
      </a>
    </>
  );
}
