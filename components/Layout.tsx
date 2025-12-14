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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-800">
      <header className="bg-brand-900 text-white shadow-lg sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div 
              className="flex items-center cursor-pointer gap-2" 
              onClick={() => setView('HOME')}
            >
              <Bus className="h-8 w-8 text-brand-500" />
              <span className="font-bold text-xl tracking-tight">Omnibus</span>
            </div>
            
            <nav className="flex space-x-4">
              <button
                onClick={() => setView('HOME')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'HOME' || currentView === 'BOOKING' ? 'bg-brand-700 text-white' : 'text-brand-100 hover:bg-brand-700'
                }`}
              >
                <Home className="w-4 h-4 mr-2" />
                Book
              </button>
              <button
                onClick={() => setView('TICKET')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'TICKET' ? 'bg-brand-700 text-white' : 'text-brand-100 hover:bg-brand-700'
                }`}
              >
                <Ticket className="w-4 h-4 mr-2" />
                My Ticket
              </button>
              <button
                onClick={() => setView('ADMIN')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'ADMIN' ? 'bg-brand-700 text-white' : 'text-brand-100 hover:bg-brand-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                Staff
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 no-print">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Omnibus Transportation Systems. "We don't reinvent the wheel, we just make it roll smoother."</p>
        </div>
      </footer>
    </div>
  );
};
