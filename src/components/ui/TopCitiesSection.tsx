"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, TrendingUp, Building2, Users } from "lucide-react";
import { FadeIn } from "@/components/ui/Animations";

const topCities = [
  {
    name: "Delhi NCR",
    slug: "Delhi",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=800",
    properties: "2,500+",
    growth: "+15%",
    description: "India's capital region with premium residential and commercial spaces"
  },
  {
    name: "Mumbai",
    slug: "Mumbai",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=800",
    properties: "1,800+",
    growth: "+12%",
    description: "The financial capital offering luxury waterfront and hillside properties"
  },
  {
    name: "Bangalore",
    slug: "Bangalore",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80&w=800",
    properties: "1,600+",
    growth: "+18%",
    description: "Silicon Valley of India with modern tech parks and premium residences"
  },
  {
    name: "Pune",
    slug: "Pune",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80&w=800",
    properties: "1,200+",
    growth: "+14%",
    description: "Cultural hub with serene hill stations and luxury gated communities"
  }
];

export default function TopCitiesSection() {
  return (
    <section className="py-32 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-gold/5 rounded-full blur-[100px] opacity-30 -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-blue/5 rounded-full blur-[80px] opacity-20 translate-y-1/3 -translate-x-1/3"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <FadeIn>
            <h4 className="text-accent-gold font-black uppercase tracking-[0.25em] mb-4 text-[10px] flex items-center justify-center gap-3">
              <MapPin size={16} /> Prime Locations
            </h4>
            <h2 className="text-5xl md:text-6xl font-black text-primary-blue mb-8 tracking-tighter">
              Top Cities
            </h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              Discover luxury real estate in India's most prestigious cities. Each location offers unique investment opportunities and lifestyle advantages.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {topCities.map((city, idx) => (
            <FadeIn key={city.slug} delay={0.1 * idx}>
              <Link
                href={`/properties?city=${city.slug}`}
                className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary-blue/10 transition-all duration-500 transform hover:-translate-y-2 border border-slate-100 hover:border-accent-gold/30"
              >
                {/* City Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>

                  {/* City Name Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-black text-white tracking-tight mb-1">
                      {city.name}
                    </h3>
                    <div className="flex items-center gap-2 text-white/90 text-xs font-bold uppercase tracking-widest">
                      <Building2 size={14} />
                      {city.properties} Properties
                    </div>
                  </div>
                </div>

                {/* City Stats */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-emerald-500" />
                      <span className="text-emerald-600 font-black text-sm">{city.growth}</span>
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Growth</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-accent-gold" />
                      <span className="text-primary-blue font-black text-sm">Premium</span>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed font-medium mb-4">
                    {city.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Explore {city.name}
                    </span>
                    <div className="w-8 h-8 bg-accent-gold rounded-full flex items-center justify-center group-hover:bg-primary-blue transition-colors">
                      <MapPin size={16} className="text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        {/* Bottom CTA */}
        <FadeIn delay={0.4}>
          <div className="text-center mt-16">
            <Link
              href="/properties"
              className="inline-flex items-center gap-4 bg-primary-blue hover:bg-primary-blue-hover text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm shadow-xl shadow-primary-blue/20 hover:scale-105 active:scale-95 transition-all"
            >
              View All Cities
              <MapPin size={20} />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
