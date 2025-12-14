import React, { useState } from 'react';
import { Booking } from '../types';
import { MOCK_ROUTES } from '../constants';
import { QrCode, Printer, Download, Search, Ticket } from 'lucide-react';

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
      <div className="no-print mb-8 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-bold mb-4">Find your ticket</h2>
        <div className="flex gap-2">
          <input 
            type="text"
            placeholder="Booking ID or Email"
            className="flex-1 border px-4 py-2 rounded-lg"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button onClick={handleSearch} className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700">
            <Search className="w-5 h-5" />
          </button>
        </div>
        {!activeBooking && searchId && (
            <p className="text-red-500 text-sm mt-2">No booking found.</p>
        )}
      </div>

      {activeBooking && route ? (
        <div className="bg-white rounded-none sm:rounded-2xl overflow-hidden shadow-2xl print:shadow-none print:w-full">
          <div className="bg-brand-900 text-white p-6 flex justify-between items-center print:bg-black">
            <div>
              <h1 className="text-2xl font-bold tracking-widest uppercase">Omnibus</h1>
              <p className="text-brand-200 text-sm">Boarding Pass</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-xl">{activeBooking.id}</p>
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex justify-between items-end mb-8 border-b pb-8 border-dashed border-gray-300">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide">Passenger</p>
                <p className="text-xl font-bold text-gray-900">{activeBooking.passenger.firstName} {activeBooking.passenger.lastName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 uppercase tracking-wide">Date</p>
                <p className="text-xl font-bold text-gray-900">{new Date(route.departureTime).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 mb-8">
              <div className="col-span-1">
                <p className="text-sm text-gray-500 uppercase tracking-wide">Origin</p>
                <p className="text-3xl font-bold text-brand-600">{route.origin.substring(0,3).toUpperCase()}</p>
                <p className="text-sm text-gray-700">{route.origin}</p>
                <p className="text-lg font-medium mt-1">{new Date(route.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
              
              <div className="col-span-1 flex flex-col justify-center items-center">
                 <div className="w-full h-1 bg-gray-300 relative">
                    <div className="absolute -top-1.5 right-0 w-3 h-3 bg-gray-300 rounded-full"></div>
                 </div>
                 <p className="text-xs text-gray-400 mt-2">{route.busNumber}</p>
              </div>

              <div className="col-span-1 text-right">
                <p className="text-sm text-gray-500 uppercase tracking-wide">Destination</p>
                <p className="text-3xl font-bold text-brand-600">{route.destination.substring(0,3).toUpperCase()}</p>
                <p className="text-sm text-gray-700">{route.destination}</p>
                <p className="text-lg font-medium mt-1">{new Date(route.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
            </div>

            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg print:border print:bg-white">
              <div>
                <p className="text-sm text-gray-500 uppercase">Seat</p>
                <p className="text-3xl font-bold">{activeBooking.seatNumber}</p>
              </div>
              <div className="flex flex-col items-center">
                 {/* Visual QR Placeholder */}
                 <div className="bg-white p-2">
                    <QrCode className="w-24 h-24 text-gray-900" />
                 </div>
                 <p className="text-[10px] text-gray-400 mt-1">Scan at gate</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 p-4 flex justify-center gap-4 no-print">
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900 transition-colors"
            >
              <Printer className="w-4 h-4" /> Print Ticket
            </button>
            <button className="flex items-center gap-2 bg-brand-600 text-white px-6 py-2 rounded hover:bg-brand-700 transition-colors">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
          <div className="inline-block p-4 bg-brand-50 rounded-full mb-4">
             <Ticket className="w-8 h-8 text-brand-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No active ticket displayed</h3>
          <p className="text-gray-500">Search for your booking above or book a new trip.</p>
        </div>
      )}
    </div>
  );
};