import React, { useState } from 'react';
import { Booking } from '../types';
import { MOCK_ROUTES } from '../constants';
import { QrCode, Printer, Download, Search, Ticket, ArrowRight, Calendar, Clock, MapPin } from 'lucide-react';

interface TicketViewProps {
  bookings: Booking[];
}

export const TicketView: React.FC<TicketViewProps> = ({ bookings }) => {
  const [searchId, setSearchId] = useState('');
  const [foundBooking, setFoundBooking] = useState<Booking | null>(null);

  const handleSearch = () => {
    const found = bookings.find(b => b.id.toLowerCase() === searchId.toLowerCase() || b.passenger.email.toLowerCase() === searchId.toLowerCase());
    setFoundBooking(found || null);
  };

  const activeBooking = foundBooking || (bookings.length > 0 ? bookings[bookings.length - 1] : null);
  const route = activeBooking ? MOCK_ROUTES.find(r => r.id === activeBooking.routeId) : null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="no-print mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold mb-4 text-gray-900">Retrieve Booking</h2>
        <div className="flex gap-3">
          <div className="relative flex-1">
             <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
             <input 
               type="text"
               placeholder="Enter Booking ID (e.g., BK12345)"
               className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
               value={searchId}
               onChange={(e) => setSearchId(e.target.value)}
             />
          </div>
          <button 
            onClick={handleSearch} 
            className="bg-brand-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-700 transition-colors"
          >
            Find
          </button>
        </div>
        {!activeBooking && searchId && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
              No booking found with that ID.
            </div>
        )}
      </div>

      {activeBooking && route ? (
        <div className="animate-slide-up">
          {/* Ticket Container */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl print:shadow-none print:w-full print:rounded-none border border-gray-200">
            {/* Header */}
            <div className="bg-brand-900 text-white p-6 sm:p-8 flex justify-between items-start print:bg-black print:text-white">
              <div>
                <div className="flex items-center gap-2 mb-2">
                   <div className="bg-white/10 p-1.5 rounded-lg">
                      <Ticket className="w-5 h-5 text-brand-300" />
                   </div>
                   <span className="font-bold tracking-widest uppercase text-sm text-brand-300">Boarding Pass</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight">Omnibus</h1>
              </div>
              <div className="text-right">
                <p className="text-xs text-brand-300 uppercase tracking-wider mb-1">Booking Ref</p>
                <p className="font-mono text-2xl font-bold tracking-wider">{activeBooking.id}</p>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="p-6 sm:p-8 relative">
              {/* Decorative notches */}
              <div className="absolute top-0 left-0 w-4 h-8 bg-brand-900 rounded-r-full -mt-4 hidden sm:block"></div>
              <div className="absolute top-0 right-0 w-4 h-8 bg-brand-900 rounded-l-full -mt-4 hidden sm:block"></div>

              <div className="flex flex-col sm:flex-row justify-between items-start mb-8 pb-8 border-b-2 border-dashed border-gray-200">
                 <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Passenger Name</label>
                    <p className="text-xl font-bold text-gray-900">{activeBooking.passenger.lastName}, {activeBooking.passenger.firstName}</p>
                 </div>
                 <div className="mt-4 sm:mt-0 text-left sm:text-right">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Travel Date</label>
                    <div className="flex items-center gap-2 sm:justify-end text-gray-900">
                       <Calendar className="w-4 h-4 text-brand-500" />
                       <p className="text-xl font-bold">{new Date(route.departureTime).toLocaleDateString(undefined, {weekday: 'short', month: 'short', day: 'numeric'})}</p>
                    </div>
                 </div>
              </div>

              {/* Route Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8 items-center">
                <div className="text-center sm:text-left">
                   <div className="text-4xl font-black text-brand-600 mb-1">{route.origin.substring(0,3).toUpperCase()}</div>
                   <div className="text-sm font-medium text-gray-600 bg-gray-100 inline-block px-2 py-0.5 rounded-full">{route.origin}</div>
                   <div className="mt-2 font-mono text-lg text-gray-800">{new Date(route.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>

                <div className="flex flex-col items-center justify-center w-full">
                   <div className="w-full flex items-center gap-2 text-gray-300 mb-1">
                      <div className="h-0.5 w-full bg-gray-200"></div>
                      <ArrowRight className="w-5 h-5 text-brand-400 flex-shrink-0" />
                      <div className="h-0.5 w-full bg-gray-200"></div>
                   </div>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bus {route.busNumber}</p>
                </div>

                <div className="text-center sm:text-right">
                   <div className="text-4xl font-black text-brand-600 mb-1">{route.destination.substring(0,3).toUpperCase()}</div>
                   <div className="text-sm font-medium text-gray-600 bg-gray-100 inline-block px-2 py-0.5 rounded-full">{route.destination}</div>
                   <div className="mt-2 font-mono text-lg text-gray-800">{new Date(route.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
              </div>

              {/* Footer / Seat Info */}
              <div className="bg-gray-50 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-6 border border-gray-100 print:bg-white print:border-2 print:border-gray-800">
                 <div className="flex gap-8 text-center sm:text-left">
                    <div>
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Seat</label>
                       <span className="text-3xl font-black text-gray-900">{activeBooking.seatNumber}</span>
                    </div>
                    <div>
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Gate</label>
                       <span className="text-3xl font-black text-gray-900">03</span>
                    </div>
                    <div>
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Class</label>
                       <span className="text-3xl font-black text-gray-900">STD</span>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-4 bg-white p-2 pr-4 rounded-xl border border-gray-100 shadow-sm print:shadow-none">
                    <div className="bg-gray-900 p-2 rounded-lg">
                       <QrCode className="w-12 h-12 text-white" />
                    </div>
                    <div className="text-left">
                       <p className="text-[10px] uppercase font-bold text-gray-400">Scan at boarding</p>
                       <p className="text-xs font-mono font-bold text-gray-900">{activeBooking.id}</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4 no-print">
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors shadow-lg hover:scale-105 transform duration-200"
            >
              <Printer className="w-5 h-5" /> Print Ticket
            </button>
            <button 
              onClick={() => alert("Ticket PDF download started...")}
              className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Download className="w-5 h-5" /> Save as PDF
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
           <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Ticket className="w-10 h-10 text-gray-400" />
           </div>
           <h3 className="text-xl font-bold text-gray-900 mb-2">No active tickets</h3>
           <p className="text-gray-500 max-w-sm mx-auto">Use the search bar above to find a booking or go back home to book a new trip.</p>
        </div>
      )}
    </div>
  );
};