import React from 'react';
import { ViewState } from '../types';
import { Bus, Ticket, ShieldCheck, Home } from 'lucide-react';

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
          <div className="flex justify-between h-20 items-center py-4">
            <div 
              className="flex items-center cursor-pointer gap-3 group" 
              onClick={() => setView('HOME')}
            >
              <div className="bg-white/10 p-2.5 rounded-xl group-hover:bg-white/20 transition-colors shadow-inner">
                 <Bus className="h-6 w-6 text-brand-300" />
              </div>
              <div>
                 <span className="font-extrabold text-2xl tracking-tight block leading-none">Omnibus</span>
                 <span className="text-[10px] text-brand-300 uppercase tracking-[0.2em] font-medium ml-0.5">Systems</span>
              </div>
            </div>
            
            <nav className="hidden sm:flex space-x-1">
              <button
                onClick={() => setView('HOME')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  currentView === 'HOME' 
                  ? 'bg-white text-brand-900 shadow-md' 
                  : 'text-brand-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </button>
              <button
                onClick={() => setView('BOOKING')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  currentView === 'BOOKING' 
                  ? 'bg-white text-brand-900 shadow-md' 
                  : 'text-brand-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Bus className="w-4 h-4 mr-2" />
                Book Trip
              </button>
              <button
                onClick={() => setView('TICKET')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  currentView === 'TICKET' 
                  ? 'bg-white text-brand-900 shadow-md' 
                  : 'text-brand-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Ticket className="w-4 h-4 mr-2" />
                My Ticket
              </button>
              <div className="w-px h-6 bg-brand-700 mx-2 self-center"></div>
              <button
                onClick={() => setView('ADMIN')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  currentView === 'ADMIN' 
                  ? 'bg-brand-800 text-white shadow-inner' 
                  : 'text-brand-300 hover:bg-white/5 hover:text-white'
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
           className={`flex flex-col items-center justify-center p-2 rounded-lg w-full ${currentView === 'HOME' ? 'text-brand-600 bg-brand-50' : 'text-gray-400'}`}
         >
            <Home className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Home</span>
         </button>
         <button 
           onClick={() => setView('BOOKING')}
           className={`flex flex-col items-center justify-center p-2 rounded-lg w-full ${currentView === 'BOOKING' ? 'text-brand-600 bg-brand-50' : 'text-gray-400'}`}
         >
            <Bus className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Book</span>
         </button>
         <button 
           onClick={() => setView('TICKET')}
           className={`flex flex-col items-center justify-center p-2 rounded-lg w-full ${currentView === 'TICKET' ? 'text-brand-600 bg-brand-50' : 'text-gray-400'}`}
         >
            <Ticket className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Tickets</span>
         </button>
      </div>

      <footer className="bg-white border-t border-gray-100 text-slate-400 py-12 no-print hidden sm:block mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div>
            <p className="font-bold text-slate-800 text-lg">Omnibus</p>
            <p className="text-sm mt-1">Professional Transportation Management</p>
          </div>
          <div className="text-xs text-slate-500 text-right">
             <p>© {new Date().getFullYear()} Omnibus Systems Inc.</p>
             <p className="mt-1">Designed for reliability.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};