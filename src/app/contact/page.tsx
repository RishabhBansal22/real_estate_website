"use client";

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { MapPin, Phone, Mail, Send, Sparkles, MessageSquare, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { FadeIn, ScaleIn } from "@/components/ui/Animations";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { buildWhatsAppUrl } from "@/lib/contactConfig";

export default function ContactPage() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // If user is logged in, save to contact history
      if (session) {
        const response = await fetch('/api/users/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            subject: formData.subject || 'General Inquiry',
            message: formData.message,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save contact');
        }
      }

      setSuccessMessage('Transmission successful! Our team will respond within 24 hours.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setErrorMessage('Failed to transmit directive. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] pt-32 pb-24 font-sans relative overflow-hidden">
      
      {/* Background aesthetics */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-blue/30 rounded-full blur-[120px] opacity-40 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-gold/5 rounded-full blur-[100px] opacity-20 translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Breadcrumb Navigation */}
        <Breadcrumb />
        
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
                        <a href={buildWhatsAppUrl("Hi Jain Properties, I need assistance.")} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2">
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
                
                {successMessage && (
                  <div className="mb-8 bg-emerald-500/10 border-l-2 border-emerald-500 p-4 flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 leading-relaxed">{successMessage}</p>
                  </div>
                )}

                {errorMessage && (
                  <div className="mb-8 bg-rose-500/10 border-l-2 border-rose-500 p-4 flex items-start gap-3">
                    <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={18} />
                    <p className="text-xs font-bold uppercase tracking-widest text-rose-500 leading-relaxed">{errorMessage}</p>
                  </div>
                )}
                
                <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2">First Name</label>
                      <input 
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-6 py-4 bg-primary-blue/50 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold transition-all text-sm font-bold text-white placeholder:text-slate-600 uppercase tracking-widest" 
                        placeholder="JOHN"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2">Last Name</label>
                      <input 
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
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
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-6 py-4 bg-primary-blue/50 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold transition-all text-sm font-bold text-white placeholder:text-slate-600 tracking-widest uppercase" 
                        placeholder="JD@DOMAIN.COM"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2">Contact Number</label>
                      <input 
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-6 py-4 bg-primary-blue/50 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold transition-all text-sm font-bold text-white placeholder:text-slate-600 tracking-widest uppercase" 
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2">Transmission Subject</label>
                    <select 
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-primary-blue/50 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold transition-all text-xs font-black text-white cursor-pointer tracking-widest uppercase appearance-none">
                      <option className="bg-primary-blue" value="">SELECT DIRECTIVE</option>
                      <option className="bg-primary-blue" value="Acquire Asset">ACQUIRE ASSET</option>
                      <option className="bg-primary-blue" value="Divest Asset">DIVEST ASSET</option>
                      <option className="bg-primary-blue" value="General Consultation">GENERAL CONSULTATION</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2">Detailed Directive</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-6 py-4 bg-primary-blue/50 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold transition-all text-sm font-bold text-white placeholder:text-slate-600 resize-none tracking-widest" 
                      placeholder="ENTER PARAMETERS..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full md:w-auto bg-accent-gold text-white py-5 px-10 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-accent-gold-hover transition-all shadow-xl shadow-accent-gold/20 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Transmitting...' : 'Transmit Directive'}
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
