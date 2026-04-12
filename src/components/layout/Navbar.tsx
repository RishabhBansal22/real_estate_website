"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Home, User as UserIcon, Search, Sparkles, Heart, Phone, MessageSquare } from "lucide-react";
import { CONTACT_PHONE_TEL, buildWhatsAppUrl } from "@/lib/contactConfig";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) setSuggestions(await res.json());
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/properties?location=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Properties", href: "/properties" },
    { name: "EMI Calculator", href: "/emi-calculator" },
    { name: "Wishlist", href: "/wishlist" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(15,23,42,0.1)] py-3 px-2 mx-auto"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className={`p-2.5 rounded-xl transition-all duration-500 ${isScrolled ? 'bg-primary-blue text-accent-gold shadow-lg shadow-primary-blue/20' : 'bg-white/10 backdrop-blur-md text-white border border-white/20'}`}>
              <Home size={22} className="group-hover:scale-110 transition-transform" />
            </div>
            <span className={`text-2xl font-black tracking-tight transition-colors duration-500 ${isScrolled ? 'text-primary-blue' : 'text-white'}`}>
              Jain<span className="text-accent-gold">Properties</span>
            </span>
          </Link>

          {/* Desktop Search Bar (Luxury Style) */}
          <div className="hidden lg:block relative flex-1 max-w-md mx-8" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                placeholder="Search premium properties..."
                className={`w-full border rounded-full py-2.5 pl-10 pr-4 text-xs font-bold transition-all duration-500 outline-none ${
                  isScrolled 
                    ? "bg-slate-50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold" 
                    : "bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-white/40"
                }`}
              />
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${isScrolled ? 'text-slate-400 group-focus-within:text-accent-gold' : 'text-white/60'}`} size={14} />
            </form>

            {/* Suggestions Overlay */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl rounded-[1.5rem] shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-3 border-b border-slate-50 flex items-center justify-between">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Curated Suggestions</span>
                   <Sparkles size={12} className="text-accent-gold mr-2" />
                </div>
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { router.push(`/properties/${item.id}`); setShowSuggestions(false); }}
                    className="w-full text-left px-5 py-3.5 hover:bg-slate-50 flex flex-col transition-colors border-b border-slate-50 last:border-0"
                  >
                    <span className="text-sm font-bold text-slate-800">{item.text}</span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{item.location} • {item.type}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs font-black uppercase tracking-widest transition-colors relative group ${isScrolled ? 'text-primary-blue' : 'text-white'}`}
                >
                  {link.name}
                  <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-accent-gold transition-all group-hover:w-full"></span>
                </Link>
              ))}
            </div>
            
            {/* Auth State Desktop */}
            <div className="flex items-center gap-6">
              {status === "loading" ? (
                <div className="w-20 h-8 bg-slate-200/20 animate-pulse rounded-full"></div>
              ) : session ? (
                <div className="relative group cursor-pointer inline-flex items-center gap-2">
                  <div className={`flex items-center gap-2 font-black text-xs uppercase tracking-widest hover:text-accent-gold transition-colors ${isScrolled ? 'text-primary-blue' : 'text-white'}`}>
                    <UserIcon size={16} className="text-accent-gold" />
                    <span>{session.user?.name?.split(' ')[0] || "Profile"}</span>
                  </div>
                  <div className="absolute top-10 right-0 w-56 bg-white border border-slate-100 shadow-2xl rounded-[1.25rem] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col pt-3 overflow-hidden translate-y-2 group-hover:translate-y-0">
                    <Link href="/wishlist" className="px-5 py-3 hover:bg-slate-50 text-xs font-bold text-slate-700 border-b border-slate-50 flex items-center gap-2">
                      <Heart size={14} className="text-accent-gold" /> My Wishlist
                    </Link>
                    <Link href="/dashboard" className="px-5 py-3 hover:bg-slate-50 text-xs font-bold text-slate-700 border-b border-slate-50">Admin Dashboard</Link>
                    <button onClick={() => signOut()} className="px-5 py-4 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-black uppercase tracking-widest text-left">
                      Close Session
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`text-xs font-black uppercase tracking-widest hover:text-accent-gold transition-colors ${isScrolled ? 'text-primary-blue' : 'text-white'}`}
                  >
                    Enter
                  </Link>
                  <Link
                    href="/register"
                    className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-lg ${
                      isScrolled 
                        ? "bg-primary-blue text-white hover:bg-secondary-blue shadow-primary-blue/20" 
                        : "bg-accent-gold text-white hover:bg-accent-gold-hover shadow-accent-gold/20"
                    }`}
                  >
                    Join
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 rounded-xl transition-all ${isScrolled ? 'text-primary-blue' : 'text-white bg-white/10'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-2xl py-8 px-6 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-lg font-black uppercase tracking-widest text-primary-blue hover:text-accent-gold transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-slate-100 my-2"></div>
          
          {/* Auth State Mobile */}
          {session ? (
            <>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Authenticated: {session.user?.name}</div>
              <Link href="/wishlist" className="text-lg font-black uppercase tracking-widest text-primary-blue flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                <Heart size={20} className="text-accent-gold" /> My Wishlist
              </Link>
              <Link href="/dashboard" className="text-lg font-black uppercase tracking-widest text-primary-blue" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <button 
                onClick={() => { signOut(); setMobileMenuOpen(false); }}
                className="text-left text-lg font-black uppercase tracking-widest text-rose-600"
              >
                End Session
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <Link
                href="/login"
                className="text-center py-4 rounded-2xl text-primary-blue font-black uppercase tracking-widest border border-primary-blue/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="text-center bg-primary-blue text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary-blue/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Quick Contact Buttons */}
          <div className="h-px bg-slate-100 my-4"></div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Quick Contact</div>
          <div className="flex flex-col gap-3">
            <a 
              href={CONTACT_PHONE_TEL ? `tel:${CONTACT_PHONE_TEL}` : "#"}
              className="flex items-center justify-center gap-2 bg-primary-blue text-white py-3 rounded-2xl font-black uppercase tracking-widest text-xs"
            >
              <Phone size={16} />
              Call Us Now
            </a>
            <a 
              href={buildWhatsAppUrl("Hi Jain Properties, I am interested.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-emerald-500 text-white py-3 rounded-2xl font-black uppercase tracking-widest text-xs"
            >
              <MessageSquare size={16} />
              WhatsApp
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
