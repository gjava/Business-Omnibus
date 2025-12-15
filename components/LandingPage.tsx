import React from 'react';
import { ViewState } from '../types';
import { ArrowRight, ShieldCheck, Clock, MapPin } from 'lucide-react';

interface LandingPageProps {
  setView: (view: ViewState) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setView }) => {
  return (
    <div className="flex flex-col animate-fade-in">
      {/* Hero Section */}
      <div className="relative bg-brand-900 text-white rounded-3xl overflow-hidden shadow-2xl mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-800 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
        
        <div className="relative z-20 px-8 py-20 sm:py-32 max-w-2xl">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Travel Comfortably.<br/>Arrive style.
          </h1>
          <p className="text-lg text-brand-100 mb-8 max-w-lg leading-relaxed">
            Experience the next generation of bus travel with Omnibus. 
            Premium seats, real-time tracking, and seamless digital ticketing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setView('BOOKING')}
              className="bg-white text-brand-900 px-8 py-4 rounded-xl font-bold hover:bg-brand-50 transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-105"
            >
              Book a Trip <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setView('TICKET')}
              className="bg-brand-800/50 backdrop-blur-sm text-white border border-brand-500/30 px-8 py-4 rounded-xl font-bold hover:bg-brand-800/70 transition-all flex items-center justify-center gap-2"
            >
              Manage My Booking
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 text-green-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Secure & Safe</h3>
          <p className="text-gray-500">Every trip is monitored 24/7. Your data and payment information are encrypted.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Punctual Service</h3>
          <p className="text-gray-500">We respect your time. Real-time updates ensure you're never left guessing.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 text-purple-600">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Routes</h3>
          <p className="text-gray-500">Connecting major cities with convenient stops and modern terminals.</p>
        </div>
      </div>

      {/* Admin Link (Subtle) */}
      <div className="text-center pb-8 opacity-50 hover:opacity-100 transition-opacity">
        <button 
          onClick={() => setView('ADMIN')}
          className="text-sm font-medium text-gray-500 flex items-center justify-center gap-2 mx-auto"
        >
          Staff Access <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};