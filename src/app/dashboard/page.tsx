"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from 'next/link';
import { useState, useEffect, Suspense } from "react";
import { User, Heart, Settings, Building, LogOut, Search, MapPin, Calendar, CheckCircle2, ShieldAlert, Plus, Edit2, Trash2, Users, Crown, Sparkles } from "lucide-react";
import PropertyCard from "@/components/ui/PropertyCard";
import { FadeIn, ScaleIn } from "@/components/ui/Animations";
import { formatIndianCurrency } from "@/lib/utils";
import { useCompare } from "@/hooks/useCompare";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0f1d] flex text-accent-gold font-black uppercase tracking-[0.3em] items-center justify-center">Initializing Dashboard Interface...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentTab = searchParams.get("tab") || "saved";
  const isAdmin = (session?.user as any)?.role === 'admin';
  const { toggleCompare, clearCompare } = useCompare();

  // User Data States
  const [savedProperties, setSavedProperties] = useState<any[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);

  // Admin Data States
  const [properties, setProperties] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProp, setEditingProp] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (isAdmin && currentTab === "manage-properties") {
      fetchAdminProperties();
    }
    if (isAdmin && currentTab === "manage-users") {
      fetchAdminUsers();
    }
    if (currentTab === "saved") {
      fetchSavedProperties();
    }
  }, [isAdmin, currentTab]);

  const fetchSavedProperties = async () => {
    setIsLoadingSaved(true);
    const res = await fetch('/api/users/wishlist');
    if (res.ok) setSavedProperties(await res.json());
    setIsLoadingSaved(false);
  };

  const fetchAdminProperties = async () => {
    setIsLoadingAdmin(true);
    const res = await fetch('/api/properties');
    if (res.ok) setProperties(await res.json());
    setIsLoadingAdmin(false);
  };

  const fetchAdminUsers = async () => {
    setIsLoadingAdmin(true);
    const res = await fetch('/api/users');
    if (res.ok) setUsers(await res.json());
    setIsLoadingAdmin(false);
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm("Confirm immediate deletion of this asset from the global portfolio?")) return;
    await fetch(`/api/properties/${id}`, { method: 'DELETE' });
    fetchAdminProperties();
  };

  const handleSaveProperty = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      title: formData.get('title'),
      location: formData.get('location'),
      type: formData.get('type'),
      price: Number(formData.get('price')),
      sqft: Number(formData.get('sqft')),
      beds: Number(formData.get('beds')),
      baths: Number(formData.get('baths')),
      targetRole: formData.get('targetRole'),
      city: formData.get('city'),
      locality: formData.get('locality'),
      highlights: formData.get('highlights')?.toString().split(',').map(h => h.trim()).filter(h => h !== ""),
      imageUrl: formData.get('imageUrl')
    };

    if (editingProp) {
      await fetch(`/api/properties/${editingProp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } else {
      await fetch(`/api/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
    setIsModalOpen(false);
    fetchAdminProperties();
  };

  if (status === "loading" || !session) {
    return <div className="min-h-screen bg-[#0a0f1d] flex text-accent-gold font-black uppercase tracking-[0.3em] items-center justify-center">Establishing Secure Link...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0f1d] pt-32 pb-24 font-sans relative overflow-hidden">
      
      {/* Background aesthetics */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-blue/30 rounded-full blur-[120px] opacity-40 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-gold/5 rounded-full blur-[100px] opacity-20 translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Dashboard Header */}
        <FadeIn>
          <div className="mb-14 text-left max-w-4xl border-b border-white/10 pb-8">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                Welcome, <span className="text-accent-gold">{session.user?.name?.split(' ')[0]}</span>
              </h1>
              {isAdmin && <span className="bg-rose-500/10 text-rose-500 font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-widest flex items-center gap-2 mt-2.5 border border-rose-500/20"><Crown size={14}/> Oracle Level</span>}
            </div>
            <p className="text-slate-400 font-medium text-lg mt-4">
              Manage your private portfolio, exclusive visitations, and secure credentials.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* Sidebar Navigation */}
          <div className="space-y-4 lg:col-span-1">
             <FadeIn delay={0.1}>
               <div className="bg-white/5 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] border border-white/10 sticky top-28 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-2xl pointer-events-none"></div>

                  <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-2xl border-2 ${isAdmin ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-accent-gold/10 text-accent-gold border-accent-gold/20'}`}>
                      {session.user?.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-black text-white tracking-wide">{session.user?.name}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[150px]">{session.user?.email}</p>
                    </div>
                  </div>

                  <nav className="space-y-3 mb-8">
                     <Link href="?tab=saved" className={`flex items-center gap-4 px-5 py-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${currentTab === 'saved' ? 'bg-accent-gold text-white shadow-lg shadow-accent-gold/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                       <Heart size={18} className={currentTab === 'saved' ? 'fill-white' : ''}/> Portfolio
                     </Link>
                     <Link href="/wishlist" className="flex items-center gap-4 px-5 py-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all text-slate-400 hover:text-white hover:bg-white/5">
                       <Heart size={18} className="text-accent-gold" /> Full Wishlist
                     </Link>
                     <Link href="?tab=tours" className={`flex items-center gap-4 px-5 py-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${currentTab === 'tours' ? 'bg-accent-gold text-white shadow-lg shadow-accent-gold/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                       <Calendar size={18} /> Visitations
                     </Link>
                     <Link href="?tab=settings" className={`flex items-center gap-4 px-5 py-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${currentTab === 'settings' ? 'bg-accent-gold text-white shadow-lg shadow-accent-gold/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                       <Settings size={18} /> Credentials
                     </Link>
                  </nav>

                  {isAdmin && (
                    <>
                      <div className="text-[10px] font-black text-rose-500/70 uppercase tracking-[0.2em] pl-5 mb-4 flex items-center gap-2">
                        <ShieldAlert size={14} /> Global Control
                      </div>
                      <nav className="space-y-3">
                         <Link href="?tab=manage-properties" className={`flex items-center gap-4 px-5 py-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${currentTab === 'manage-properties' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                           <Building size={18} /> Assets
                         </Link>
                         <Link href="?tab=manage-users" className={`flex items-center gap-4 px-5 py-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${currentTab === 'manage-users' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                           <Users size={18} /> Identities
                         </Link>
                      </nav>
                    </>
                  )}
               </div>
             </FadeIn>
          </div>

          {/* Main Dashboard Content Area */}
          <div className="lg:col-span-3 space-y-8">
             
             {/* Dynamic Content based on currentTab */}
             {currentTab === 'saved' && (
               <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
                    <h3 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
                      <Sparkles size={24} className="text-accent-gold" /> Acquired Interests
                    </h3>
                    <div className="flex items-center gap-4">
                      {savedProperties.length > 1 && (
                        <button 
                          onClick={() => {
                            clearCompare();
                            savedProperties.slice(0, 4).forEach(p => toggleCompare(p.id));
                            router.push('/compare');
                          }}
                          className="bg-white/10 hover:bg-accent-gold hover:text-white text-accent-gold border border-accent-gold/20 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                        >
                          Analyze Top 4
                        </button>
                      )}
                      <span className="bg-accent-gold text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-accent-gold/20">{savedProperties.length} Retained</span>
                    </div>
                  </div>

                  {isLoadingSaved ? (
                     <div className="p-20 text-center text-accent-gold font-black text-xs uppercase tracking-widest animate-pulse">Retrieving Portfolio Data...</div>
                  ) : savedProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {savedProperties.map((prop, idx) => (
                         <FadeIn key={prop.id} delay={0.1 * idx}>
                           <PropertyCard property={prop} />
                         </FadeIn>
                       ))}
                    </div>
                  ) : (
                    <FadeIn>
                      <div className="bg-white/5 backdrop-blur-2xl p-12 rounded-[3.5rem] border border-white/10 min-h-[400px] flex flex-col items-center justify-center text-center">
                          <div className="w-24 h-24 bg-primary-blue/50 rounded-full flex flex-col items-center justify-center text-accent-gold mb-8 border border-white/10">
                            <Search size={40} />
                          </div>
                          <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Empty Vault</h3>
                          <p className="text-slate-400 font-medium max-w-sm mb-10 text-lg leading-relaxed">
                            No properties have been designated for your private collection. 
                          </p>
                          <Link href="/properties" className="bg-accent-gold text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-accent-gold/20 hover:scale-105 transition-all">
                            Explore Masterpieces
                          </Link>
                      </div>
                    </FadeIn>
                  )}
               </div>
             )}

             {currentTab === 'tours' && (
               <FadeIn>
                 <div className="bg-white/5 backdrop-blur-2xl p-12 rounded-[3.5rem] border border-white/10 min-h-[400px] flex flex-col pt-10">
                    <h3 className="text-2xl font-black text-white mb-8 border-b border-white/10 pb-6 tracking-tighter">Scheduled Itineraries</h3>
                    <div className="flex flex-col items-center justify-center text-center my-auto py-10">
                      <div className="w-24 h-24 bg-primary-blue/50 rounded-full flex flex-col items-center justify-center text-slate-500 mb-8 border border-white/10">
                         <Calendar size={40} />
                      </div>
                      <h4 className="text-2xl font-black text-white mb-4 tracking-tight">Schedule Clear</h4>
                      <p className="text-slate-400 font-medium max-w-sm mb-8 text-lg leading-relaxed">Contact your concierge to organize a private showing.</p>
                    </div>
                 </div>
               </FadeIn>
             )}

             {currentTab === 'settings' && (
               <FadeIn>
                 <div className="bg-white/5 backdrop-blur-2xl p-12 rounded-[3.5rem] border border-white/10 min-h-[400px]">
                    <h3 className="text-2xl font-black text-white mb-10 border-b border-white/10 pb-6 tracking-tighter">Identity Management</h3>
                    <div className="space-y-8 max-w-xl">
                      <div>
                        <label className="block text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2 mb-3">Recognized Name</label>
                        <input type="text" readOnly value={session.user?.name || ''} className="w-full bg-primary-blue/30 border border-white/10 rounded-2xl px-6 py-4 font-bold text-slate-300 cursor-not-allowed uppercase tracking-widest text-[10px]" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2 mb-3">Secure Communication (Email)</label>
                        <input type="email" readOnly value={session.user?.email || ''} className="w-full bg-primary-blue/30 border border-white/10 rounded-2xl px-6 py-4 font-bold text-slate-300 cursor-not-allowed uppercase tracking-widest text-[10px]" />
                      </div>
                    </div>
                 </div>
               </FadeIn>
             )}

             {/* ADMIN TAB: Manage Properties */}
             {isAdmin && currentTab === 'manage-properties' && (
               <FadeIn>
                 <div className="bg-white/5 backdrop-blur-2xl rounded-[3.5rem] border border-white/10 overflow-hidden">
                    <div className="p-10 border-b border-white/10 flex justify-between items-center bg-primary-blue/20">
                      <h3 className="text-2xl font-black text-white tracking-tighter">Global Assets</h3>
                      <button onClick={() => { setEditingProp(null); setIsModalOpen(true); }} className="bg-accent-gold text-white px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-accent-gold-hover transition-colors shadow-lg shadow-accent-gold/20">
                        <Plus size={16} /> Mint Asset
                      </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-primary-blue/30 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          <tr>
                            <th className="p-6 pl-10">Asset Reference</th>
                            <th className="p-6 text-right">Valuation</th>
                            <th className="p-6 text-center">Class</th>
                            <th className="p-6 text-right pr-10">Control</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-white font-medium">
                          {isLoadingAdmin ? <tr><td colSpan={4} className="p-10 text-center text-accent-gold font-black text-xs uppercase tracking-widest">Synchronizing...</td></tr> : properties.map(property => (
                            <tr key={property.id} className="hover:bg-primary-blue/30 transition-colors">
                              <td className="p-6 pl-10">
                                 <div className="font-bold flex items-center gap-5 text-sm uppercase tracking-wide">
                                   <img src={property.imageUrl} alt="" className="w-14 h-14 rounded-xl object-cover border border-white/10" />
                                   {property.title}
                                 </div>
                              </td>
                              <td className="p-6 text-accent-gold font-black text-right tracking-wider">{formatIndianCurrency(property.price)}</td>
                              <td className="p-6 text-center">
                                <span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">{property.type}</span>
                              </td>
                              <td className="p-6 text-right pr-10 flex items-center justify-end gap-3 h-full pt-10">
                                <button onClick={() => { setEditingProp(property); setIsModalOpen(true); }} className="p-3 text-blue-400 hover:bg-blue-400/10 rounded-xl transition-colors border border-transparent hover:border-blue-400/20"><Edit2 size={16} /></button>
                                <button onClick={() => handleDeleteProperty(property.id)} className="p-3 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors border border-transparent hover:border-rose-500/20"><Trash2 size={16} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                 </div>
               </FadeIn>
             )}

             {/* ADMIN TAB: Manage Users */}
             {isAdmin && currentTab === 'manage-users' && (
               <FadeIn>
                 <div className="bg-white/5 backdrop-blur-2xl rounded-[3.5rem] border border-white/10 overflow-hidden">
                    <div className="p-10 border-b border-white/10 bg-primary-blue/20">
                      <h3 className="text-2xl font-black text-white tracking-tighter">Recognized Identities</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-primary-blue/30 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          <tr>
                            <th className="p-6 pl-10">Name</th>
                            <th className="p-6">Secure Line</th>
                            <th className="p-6 text-right pr-10">Authorization</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 font-bold text-white text-xs tracking-wider uppercase">
                          {isLoadingAdmin ? <tr><td colSpan={3} className="p-10 text-center text-accent-gold">Loading...</td></tr> : users.map(user => (
                            <tr key={user.id} className="hover:bg-primary-blue/30 transition-colors">
                              <td className="p-6 pl-10">{user.name}</td>
                              <td className="p-6 text-slate-400">{user.email}</td>
                              <td className="p-6 text-right pr-10">
                                <span className={`px-4 py-1.5 text-[9px] font-black rounded-full uppercase tracking-[0.2em] border ${user.role === 'admin' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-white/10 text-white border-white/10'}`}>
                                  {user.role}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                 </div>
               </FadeIn>
             )}

          </div>
        </div>
      </div>

      {/* Admin Add/Edit Modal - Luxury Themed */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0a0f1d]/80 backdrop-blur-xl flex items-center justify-center p-4">
           <ScaleIn>
             <div className="bg-primary-blue border border-white/10 rounded-[3rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/10 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="p-8 border-b border-white/10 flex justify-between items-center sticky top-0 bg-primary-blue/90 backdrop-blur z-20">
                  <h3 className="text-2xl font-black text-white tracking-tighter">{editingProp ? 'Modify Asset Variables' : 'Mint New Asset'}</h3>
                  <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 transition-all">X</button>
                </div>
                <form onSubmit={handleSaveProperty} className="p-10 grid grid-cols-2 gap-8 relative z-10">
                   <div className="col-span-2">
                     <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2 mb-3 block">Asset Title</label>
                     <input required name="title" defaultValue={editingProp?.title} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold outline-none text-white text-sm" placeholder="e.g. Premium Smart Farm" />
                   </div>
                   <div className="col-span-2">
                     <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2 mb-3 block">Location Sector</label>
                     <input required name="location" defaultValue={editingProp?.location} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold outline-none text-white text-sm" placeholder="e.g. River Valley" />
                   </div>
                   <div className="col-span-2">
                     <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2 mb-3 block">Visual Reference (URL)</label>
                     <input required name="imageUrl" defaultValue={editingProp?.imageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800'} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold outline-none text-white text-sm" />
                   </div>
                   <div>
                     <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2 mb-3 block">Capital Required (₹)</label>
                     <input required type="number" name="price" defaultValue={editingProp?.price} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold outline-none text-white text-sm" />
                   </div>
                   <div>
                     <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2 mb-3 block">Asset Class</label>
                     <select name="type" defaultValue={editingProp?.type || 'Apartment'} className="w-full px-6 py-4 bg-primary-blue border border-white/10 rounded-2xl font-bold focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold outline-none text-white text-sm">
                       <option>Apartment</option><option>Villa</option><option>Plot</option><option>Commercial</option>
                     </select>
                   </div>
                   <div>
                     <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2 mb-3 block">Domain Area (Sqft)</label>
                     <input required type="number" name="sqft" defaultValue={editingProp?.sqft} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold outline-none text-white text-sm" />
                   </div>
                   <div>
                     <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2 mb-3 block">BHK</label>
                     <input type="number" name="beds" defaultValue={editingProp?.beds || 0} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold outline-none text-white text-sm" />
                   </div>
                   <div>
                     <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2 mb-3 block">Bathrooms</label>
                     <input type="number" name="baths" defaultValue={editingProp?.baths || 0} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold outline-none text-white text-sm" />
                   </div>
                   <div>
                     <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2 mb-3 block">City</label>
                     <select required name="city" defaultValue={editingProp?.city || 'Delhi'} className="w-full px-6 py-4 bg-primary-blue border border-white/10 rounded-2xl font-bold focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold outline-none text-white text-sm">
                       <option value="Delhi">Delhi</option>
                       <option value="Noida">Noida</option>
                       <option value="Gurugram">Gurugram</option>
                       <option value="Mumbai">Mumbai</option>
                       <option value="Bangalore">Bangalore</option>
                     </select>
                   </div>
                   <div>
                     <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2 mb-3 block">Locality</label>
                     <input required name="locality" defaultValue={editingProp?.locality} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold outline-none text-white text-sm" placeholder="e.g. Sector 62" />
                   </div>
                   <div className="col-span-2">
                     <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2 mb-3 block">Short Highlights (Comma separated)</label>
                     <input name="highlights" defaultValue={editingProp?.highlights?.join(', ')} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold outline-none text-white text-sm" placeholder="e.g. Near Metro, Ready to move, Vastu Compliant" />
                   </div>
                   
                   <div className="col-span-2 pt-8 border-t border-white/10 flex justify-end">
                     <button type="submit" className="bg-accent-gold text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-accent-gold-hover transition-all shadow-xl shadow-accent-gold/20">
                       Commit Changes
                     </button>
                   </div>
                </form>
             </div>
           </ScaleIn>
        </div>
      )}
    </div>
  );
}
