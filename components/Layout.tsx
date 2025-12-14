import React from 'react';
import { ViewState } from '../types';
import { Bus, Ticket, ShieldCheck, Home, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-800 pb-20 sm:pb-0">
      <header className="bg-brand-900 text-white shadow-xl sticky top-0 z-50 no-print backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-18 items-center py-4">
            <div 
              className="flex items-center cursor-pointer gap-3 group" 
              onClick={() => setView('HOME')}
            >
              <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors">
                 <Bus className="h-6 w-6 text-brand-300" />
              </div>
              <div>
                 <span className="font-extrabold text-xl tracking-tight block leading-none">Omnibus</span>
                 <span className="text-[10px] text-brand-300 uppercase tracking-widest font-medium">Transport Manager</span>
              </div>
            </div>
            
            <nav className="hidden sm:flex space-x-2">
              <button
                onClick={() => setView('HOME')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === 'HOME' || currentView === 'BOOKING' 
                  ? 'bg-white/10 text-white shadow-inner' 
                  : 'text-brand-100 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Home className="w-4 h-4 mr-2" />
                Book
              </button>
              <button
                onClick={() => setView('TICKET')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === 'TICKET' 
                  ? 'bg-white/10 text-white shadow-inner' 
                  : 'text-brand-100 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Ticket className="w-4 h-4 mr-2" />
                My Ticket
              </button>
              <button
                onClick={() => setView('ADMIN')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === 'ADMIN' 
                  ? 'bg-white/10 text-white shadow-inner' 
                  : 'text-brand-100 hover:bg-white/5 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                Staff
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-slide-up">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex justify-around p-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] no-print">
         <button 
           onClick={() => setView('HOME')}
           className={`flex flex-col items-center justify-center p-2 rounded-lg w-full ${currentView === 'HOME' || currentView === 'BOOKING' ? 'text-brand-600 bg-brand-50' : 'text-gray-400'}`}
         >
            <Home className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Book</span>
         </button>
         <button 
           onClick={() => setView('TICKET')}
           className={`flex flex-col items-center justify-center p-2 rounded-lg w-full ${currentView === 'TICKET' ? 'text-brand-600 bg-brand-50' : 'text-gray-400'}`}
         >
            <Ticket className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Tickets</span>
         </button>
         <button 
           onClick={() => setView('ADMIN')}
           className={`flex flex-col items-center justify-center p-2 rounded-lg w-full ${currentView === 'ADMIN' ? 'text-brand-600 bg-brand-50' : 'text-gray-400'}`}
         >
            <ShieldCheck className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Staff</span>
         </button>
      </div>

      <footer className="bg-slate-900 text-slate-400 py-12 no-print hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-semibold text-slate-300">Omnibus Transportation Systems</p>
          <p className="text-sm mt-2 opacity-60">"We don't reinvent the wheel, we just make it roll smoother."</p>
          <div className="mt-8 text-xs text-slate-600">
             © {new Date().getFullYear()} All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};