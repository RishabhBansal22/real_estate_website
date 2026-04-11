"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ChevronDown, X, Star, Zap, Sparkles } from "lucide-react";
import { FadeIn } from "@/components/ui/Animations";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PropertyCard from "@/components/ui/PropertyCard";

interface PropertyData {
  id: string;
  title: string;
  price: number;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  imageUrl: string;
  type: string;
  status?: string;
  createdAt?: string;
  city?: string;
  locality?: string;
  highlights?: string[];
  isVerified?: boolean;
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center font-black">Loading Portfolio...</div>}>
      <PropertiesContent />
    </Suspense>
  );
}

function PropertiesContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [city, setCity] = useState(searchParams.get('city') || "");
  const [keyword, setKeyword] = useState(searchParams.get('location') || "");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(() => {
    const rawType = searchParams.get('type');
    if (!rawType) return [];
    // Capitalize first letter without regex to avoid Turbopack parse issue
    const capitalized = rawType.charAt(0).toUpperCase() + rawType.slice(1);
    return [capitalized];
  });
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ 
    min: "", 
    max: searchParams.get('budget') || "" 
  });
  const [minBeds, setMinBeds] = useState(searchParams.get('beds') || "Any");
  const [selectedHighlights, setSelectedHighlights] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Recommended");
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = 6;

  // Fetch from API on mount
  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProperties(data);
        } else {
          console.warn("API returned non-array data:", data);
          setProperties([]);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load properties:", err);
        setProperties([]);
        setIsLoading(false);
      });
  }, []);

  // Handlers
  const handleTypeSelect = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
    setCurrentPage(1); // Reset page on filter
  };

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
    setCurrentPage(1); // Reset page on filter
  };

  const handleHighlightSelect = (highlight: string) => {
    setSelectedHighlights(prev => 
      prev.includes(highlight) ? prev.filter(h => h !== highlight) : [...prev, highlight]
    );
    setCurrentPage(1); // Reset page on filter
  };

  const clearFilters = () => {
    setCity("");
    setKeyword("");
    setSelectedTypes([]);
    setSelectedStatus([]);
    setPriceRange({ min: "", max: "" });
    setMinBeds("Any");
    setSelectedHighlights([]);
    setCurrentPage(1);
  };

  // Derived State (The Logic Engine)
  const filteredAndSortedProperties = useMemo(() => {
    if (!Array.isArray(properties)) return [];
    let result = [...properties];

    // 1. City search
    if (city) {
      result = result.filter(p => p.city?.toLowerCase() === city.toLowerCase());
    }

    // 2. Keyword search (locality/title)
    if (keyword.trim()) {
      const lowerKey = keyword.toLowerCase();
      result = result.filter(p => 
        p.locality?.toLowerCase().includes(lowerKey) || 
        p.title?.toLowerCase().includes(lowerKey) ||
        p.location?.toLowerCase().includes(lowerKey)
      );
    }

    // 3. Property Type
    if (selectedTypes.length > 0 && !selectedTypes.includes("Any")) {
      result = result.filter(p => selectedTypes.includes(p.type));
    }

    // 3.5. Property Status
    if (selectedStatus.length > 0) {
      result = result.filter(p => p.status ? selectedStatus.includes(p.status) : false);
    }

    // 3.6. Highlights (Hot Deal, New)
    if (selectedHighlights.length > 0) {
      result = result.filter(p => 
        p.highlights ? selectedHighlights.some(h => p.highlights.includes(h)) : false
      );
    }

    // 4. Price
    const minP = parseInt(priceRange.min);
    const maxP = parseInt(priceRange.max);
    if (!isNaN(minP)) result = result.filter(p => p.price >= minP);
    if (!isNaN(maxP)) result = result.filter(p => p.price <= maxP);

    // 5. BHK Configuration
    const beds = parseInt(minBeds);
    if (!isNaN(beds)) result = result.filter(p => p.beds >= beds);

    // 6. Sorting
    result.sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.price - b.price;
      if (sortBy === "Price: High to Low") return b.price - a.price;
      if (sortBy === "Newest Listings") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0; // Recommended
    });

    return result;
  }, [properties, city, keyword, selectedTypes, selectedStatus, selectedHighlights, priceRange, minBeds, sortBy]);

  // Pagination Math
  const totalPages = Math.ceil(filteredAndSortedProperties.length / ITEMS_PER_PAGE);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProperties = filteredAndSortedProperties.slice(offset, offset + ITEMS_PER_PAGE);

  // Force page 1 if current page becomes invalid due to aggressive filtering
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages]); // Remove currentPage from dependencies to avoid cascading renders

  return (
    <div className="min-h-screen bg-white pt-24 pb-24 font-sans">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Breadcrumb Navigation */}
        <Breadcrumb />
        
        {/* Page Header */}
        <FadeIn>
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black text-primary-blue mb-6 tracking-tighter leading-[0.9]">
              The <span className="text-accent-gold">Legacy</span> Portfolio
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] max-w-xl mx-auto">
              Curating the world's most distinguished estates, metropolitan penthouses, and landmark investment opportunities.
            </p>
          </div>
        </FadeIn>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar (Desktop) / Dropdown (Mobile) - Luxury Overhaul */}
          <div className="lg:w-1/4">
            <FadeIn delay={0.1}>
              <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 p-8 sticky top-28 shadow-2xl shadow-slate-200/20 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                
                <div className="flex items-center justify-between mb-8 lg:hidden">
                  <h3 className="font-black text-xs uppercase tracking-widest text-primary-blue">Filters</h3>
                  <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="p-3 bg-white rounded-2xl text-accent-gold shadow-md"
                  >
                    <SlidersHorizontal size={20} />
                  </button>
                </div>

                <div className={`space-y-10 relative z-10 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
                  {/* City Select */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">City Search</label>
                    <select 
                      value={city || ""}
                      onChange={(e) => { setCity(e.target.value); setCurrentPage(1); }}
                      className="w-full px-5 py-4 bg-white text-primary-blue font-black text-[10px] rounded-2xl outline-none focus:ring-4 focus:ring-accent-gold/5 border border-slate-100 appearance-none cursor-pointer uppercase tracking-widest"
                    >
                      <option value="">ALL CITIES</option>
                      <option value="delhi">DELHI / NCR</option>
                      <option value="noida">NOIDA</option>
                      <option value="gurugram">GURUGRAM</option>
                      <option value="mumbai">MUMBAI</option>
                      <option value="bangalore">BANGALORE</option>
                    </select>
                  </div>

                  {/* Locality Search */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Locality Keyword</label>
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-gold transition-transform group-focus-within:scale-110" size={16} />
                      <input 
                        type="text" 
                        placeholder="E.G. SECTOR 62..." 
                        value={keyword}
                        onChange={(e) => { setKeyword(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-12 pr-4 py-4 bg-white text-primary-blue font-black tracking-widest text-[10px] rounded-2xl focus:outline-none focus:ring-4 focus:ring-accent-gold/5 border border-slate-100 transition-all uppercase"
                      />
                    </div>
                  </div>

                  {/* Property Type */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Domain Category</label>
                    <div className="grid grid-cols-1 gap-3">
                      {['Apartment', 'Villa', 'Plot', 'Commercial'].map((type, i) => (
                        <button 
                          key={i} 
                          onClick={() => handleTypeSelect(type)}
                          className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                            selectedTypes.includes(type) 
                              ? 'bg-primary-blue text-white border-primary-blue shadow-lg shadow-primary-blue/20' 
                              : 'bg-white text-slate-400 border-slate-100 hover:border-accent-gold hover:text-accent-gold'
                          }`}
                        >
                          <div className={`w-2.5 h-2.5 rounded-full ${selectedTypes.includes(type) ? 'bg-accent-gold scale-125' : 'bg-slate-200'}`}></div>
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Property Status */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Property Status</label>
                    <div className="grid grid-cols-1 gap-3">
                      {['Ready to Move', 'Under Construction'].map((status, i) => (
                        <button 
                          key={i} 
                          onClick={() => handleStatusSelect(status)}
                          className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                            selectedStatus.includes(status) 
                              ? 'bg-accent-gold text-white border-accent-gold shadow-lg shadow-accent-gold/20' 
                              : 'bg-white text-slate-400 border-slate-100 hover:border-accent-gold hover:text-accent-gold'
                          }`}
                        >
                          <div className={`w-2.5 h-2.5 rounded-full ${selectedStatus.includes(status) ? 'bg-primary-blue scale-125' : 'bg-slate-200'}`}></div>
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Highlights Filter */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Special Offers</label>
                    <div className="grid grid-cols-1 gap-3">
                      {['Hot Deal', 'New'].map((highlight, i) => {
                        const icon = highlight === 'Hot Deal' ? <Zap size={14} /> : <Sparkles size={14} />;
                        const bgColor = highlight === 'Hot Deal' ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200';
                        const selectedColor = highlight === 'Hot Deal' ? 'bg-rose-500 border-rose-500' : 'bg-emerald-500 border-emerald-500';
                        return (
                          <button 
                            key={i} 
                            onClick={() => handleHighlightSelect(highlight)}
                            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                              selectedHighlights.includes(highlight) 
                                ? `${selectedColor} text-white shadow-lg` 
                                : `${bgColor} text-slate-600 hover:text-slate-700`
                            }`}
                          >
                            {icon}
                            {highlight}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Budget Dropdowns */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Budget Range</label>
                    <div className="flex flex-col gap-3">
                      <select 
                        value={priceRange.min}
                        onChange={(e) => { setPriceRange(p => ({ ...p, min: e.target.value })); setCurrentPage(1); }}
                        className="w-full px-5 py-4 bg-white text-primary-blue font-black text-[10px] rounded-2xl outline-none focus:ring-4 focus:ring-accent-gold/5 border border-slate-100 appearance-none cursor-pointer uppercase tracking-widest"
                      >
                         <option value="">MIN BUDGET</option>
                         <option value="1000000">₹10 LACS</option>
                         <option value="2500000">₹25 LACS</option>
                         <option value="5000000">₹50 LACS</option>
                         <option value="10000000">₹1 CRORE</option>
                         <option value="50000000">₹5 CRORE</option>
                      </select>
                      <select 
                        value={priceRange.max}
                        onChange={(e) => { setPriceRange(p => ({ ...p, max: e.target.value })); setCurrentPage(1); }}
                        className="w-full px-5 py-4 bg-white text-primary-blue font-black text-[10px] rounded-2xl outline-none focus:ring-4 focus:ring-accent-gold/5 border border-slate-100 appearance-none cursor-pointer uppercase tracking-widest"
                      >
                         <option value="">MAX BUDGET</option>
                         <option value="5000000">₹50 LACS</option>
                         <option value="10000000">₹1 CRORE</option>
                         <option value="50000000">₹5 CRORE</option>
                         <option value="100000000">₹10 CRORE+</option>
                      </select>
                    </div>
                  </div>

                  {/* Rooms */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Space Configuration</label>
                    <div className="grid grid-cols-1 gap-3">
                      <select 
                        value={minBeds} 
                        onChange={(e) => { setMinBeds(e.target.value); setCurrentPage(1); }}
                        className="w-full px-5 py-4 bg-white text-primary-blue font-black text-[10px] rounded-2xl outline-none focus:ring-4 focus:ring-accent-gold/5 border border-slate-100 appearance-none cursor-pointer uppercase tracking-widest"
                      >
                        <option value="Any">BHK: ANY</option>
                        <option value="1">1 BHK</option>
                        <option value="2">2 BHK</option>
                        <option value="3">3 BHK</option>
                        <option value="4">4+ BHK</option>
                      </select>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="pt-8 border-t border-slate-200">
                    <button 
                      onClick={clearFilters}
                      className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-rose-500 transition-colors"
                    >
                       <X size={14} /> Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Properties Grid Area */}
          <div className="lg:w-3/4">
            <FadeIn delay={0.2}>
              {/* Top Bar (Results count & Sort) */}
              <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/20 border border-slate-100 mb-10 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-accent-gold shadow-inner"><Star size={24} /></div>
                  <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
                    Displaying <span className="text-primary-blue text-lg ml-1">{filteredAndSortedProperties.length}</span> Masterpieces
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order by:</span>
                  <div className="relative">
                    <select 
                      value={sortBy}
                      onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                      className="appearance-none bg-slate-50 text-primary-blue font-black text-[10px] uppercase tracking-widest py-3.5 pl-6 pr-12 rounded-2xl outline-none cursor-pointer focus:ring-4 focus:ring-accent-gold/5 transition-all border border-slate-100"
                    >
                      <option>Recommended</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Newest Listings</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-accent-gold pointer-events-none" size={14} />
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Empty State */}
            {currentProperties.length === 0 && (
              <FadeIn>
                <div className="flex flex-col items-center justify-center p-24 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200 w-full mb-12">
                   <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-accent-gold shadow-xl mb-8">
                     <Search size={40} />
                   </div>
                   <h3 className="text-3xl font-black text-primary-blue mb-4 tracking-tight">No Acquisitions Found</h3>
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] text-center max-w-sm mb-10 leading-relaxed">We couldn&apos;t locate any properties matching your distinguished criteria. Consider expanding your parameters.</p>
                   <button onClick={clearFilters} className="bg-primary-blue text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-2xl shadow-primary-blue/20 hover:bg-black">
                     Reset Selection
                   </button>
                </div>
              </FadeIn>
            )}

            {/* Grid */}
            {isLoading ? (
               <div className="flex items-center justify-center p-20 w-full animate-pulse text-emerald-500">
                  <span className="font-bold text-lg">Loading properties...</span>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                 {currentProperties.map(property => (
                   <PropertyCard key={property.id} property={property} />
                 ))}
               </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <FadeIn>
                <div className="flex justify-center mt-20 mb-8">
                  <div className="flex items-center gap-4 bg-white p-3 rounded-[2rem] shadow-2xl shadow-slate-200/40 border border-slate-100">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-6 py-3 flex items-center justify-center rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary-blue hover:bg-slate-50 transition-all disabled:opacity-20"
                    >
                      Previous
                    </button>
                    
                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button 
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-12 h-12 flex items-center justify-center rounded-2xl text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-primary-blue text-white shadow-xl shadow-primary-blue/20 scale-110' : 'text-slate-400 hover:bg-slate-50 hover:text-primary-blue'}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-6 py-3 flex items-center justify-center rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary-blue hover:bg-slate-50 transition-all disabled:opacity-20"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </FadeIn>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
