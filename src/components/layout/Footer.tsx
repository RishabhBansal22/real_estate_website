import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, Home } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary-blue text-white pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Brand & Intro */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="bg-accent-gold text-white p-3 rounded-2xl group-hover:scale-110 transition-transform shadow-lg shadow-accent-gold/20">
                <Home size={28} />
              </div>
              <span className="text-3xl font-black tracking-tighter text-white">
                Aura<span className="text-accent-gold">Estates</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs font-bold leading-relaxed uppercase tracking-wider">
              A curated collection of the world's most distinguished properties. From architectural masterpieces to historic landmarks, we redefine the art of fine living.
            </p>
            <div className="flex gap-5">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center hover:bg-accent-gold hover:text-white transition-all duration-500 border border-white/10 hover:border-accent-gold hover:-translate-y-1">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Sections Logic */}
          {[
            { 
              title: "Discover", 
              links: [
                { name: "Global Portfolio", href: "/properties" },
                { name: "New Acquisitions", href: "/properties?new=true" },
                { name: "Private Viewings", href: "/contact" },
                { name: "The Estates Blog", href: "/blog" }
              ] 
            },
            { 
              title: "Collections", 
              links: [
                { name: "Luxury Penthouses", href: "/properties?type=apartment" },
                { name: "Coastal Estates", href: "/properties?type=villa" },
                { name: "Metropolitan Lofts", href: "/properties?type=commercial" },
                { name: "Historic Manors", href: "/properties?type=house" }
              ] 
            }
          ].map((section, idx) => (
            <div key={idx}>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-gold mb-10">{section.title}</h3>
              <ul className="space-y-5">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link href={link.href} className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Concierge Service */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-gold mb-10">Private Concierge</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="text-accent-gold shrink-0" size={18} />
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 leading-relaxed">
                  123 Luxury Avenue, Suite 500<br />
                  Beverly Hills, CA 90210
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="text-accent-gold shrink-0" size={18} />
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">+1 (800) 123-4567</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="text-accent-gold shrink-0" size={18} />
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">concierge@auraestates.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-10 mt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            &copy; {new Date().getFullYear()} Aura Estates • The Pinnacle of Luxury Real Estate
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">Disclosures</Link>
            <Link href="/terms" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">Privacy Charter</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
