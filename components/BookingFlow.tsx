import React, { useState, useEffect } from 'react';
import { BusRoute, Booking, BookingStatus, Passenger } from '../types';
import { CITIES, MOCK_ROUTES } from '../constants';
import { getDestinationInsights } from '../services/geminiService';
import { Search, MapPin, Calendar, ArrowRight, User, CreditCard, Sparkles } from 'lucide-react';

interface BookingFlowProps {
  onBookingComplete: (booking: Booking) => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({ onBookingComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [searchParams, setSearchParams] = useState({ origin: 'Paris', destination: 'Lyon', date: '' });
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
  const [passenger, setPassenger] = useState<Passenger>({ firstName: '', lastName: '', email: '' });
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  // Fetch AI insights when destination changes
  useEffect(() => {
    const fetchInsight = async () => {
      setLoadingAi(true);
      const text = await getDestinationInsights(searchParams.destination);
      setAiInsight(text);
      setLoadingAi(false);
    };
    
    // Debounce or simple check
    if(searchParams.destination) {
      const timer = setTimeout(fetchInsight, 800);
      return () => clearTimeout(timer);
    }
  }, [searchParams.destination]);

  const filteredRoutes = MOCK_ROUTES.filter(
    (r) => r.origin === searchParams.origin && r.destination === searchParams.destination
  );

  const handleBook = () => {
    if (!selectedRoute) return;
    
    const newBooking: Booking = {
      id: `bk_${Math.floor(Math.random() * 10000)}`,
      routeId: selectedRoute.id,
      passenger,
      status: BookingStatus.CONFIRMED,
      bookingDate: new Date().toISOString(),
      seatNumber: Math.floor(Math.random() * selectedRoute.totalSeats) + 1
    };
    
    // Simulate API call
    setTimeout(() => {
      onBookingComplete(newBooking);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className={`flex items-center ${step >= 1 ? 'text-brand-600' : 'text-gray-400'}`}>
          <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold">1</div>
          <span className="ml-2 font-medium">Search</span>
        </div>
        <div className="w-12 h-1 bg-gray-200 mx-4" />
        <div className={`flex items-center ${step >= 2 ? 'text-brand-600' : 'text-gray-400'}`}>
          <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold">2</div>
          <span className="ml-2 font-medium">Details</span>
        </div>
        <div className="w-12 h-1 bg-gray-200 mx-4" />
        <div className={`flex items-center ${step >= 3 ? 'text-brand-600' : 'text-gray-400'}`}>
          <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold">3</div>
          <span className="ml-2 font-medium">Pay</span>
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white rounded-xl shadow-xl p-6 sm:p-10 animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Find your journey</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <select 
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  value={searchParams.origin}
                  onChange={(e) => setSearchParams({...searchParams, origin: e.target.value})}
                >
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-brand-500 w-5 h-5" />
                <select 
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  value={searchParams.destination}
                  onChange={(e) => setSearchParams({...searchParams, destination: e.target.value})}
                >
                  {CITIES.filter(c => c !== searchParams.origin).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* AI Insight Box */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-lg p-4 mb-8 flex items-start gap-3">
             <Sparkles className="w-5 h-5 text-indigo-500 mt-1 flex-shrink-0" />
             <div>
               <h4 className="text-sm font-bold text-indigo-800 uppercase tracking-wide">Destination Insight</h4>
               <p className="text-indigo-900 text-sm mt-1">
                 {loadingAi ? 'Asking Gemini...' : aiInsight}
               </p>
             </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Available Routes</h3>
            {filteredRoutes.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                No routes found for this selection. Try changing cities.
              </div>
            ) : (
              filteredRoutes.map(route => (
                <div 
                  key={route.id}
                  onClick={() => { setSelectedRoute(route); setStep(2); }}
                  className="border rounded-lg p-4 hover:border-brand-500 hover:shadow-md cursor-pointer transition-all flex justify-between items-center bg-white"
                >
                  <div>
                    <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
                      {new Date(route.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      {new Date(route.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Bus {route.busNumber} • Standard Class</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-brand-600">${route.price}</div>
                    <div className="text-xs text-green-600 font-medium">{route.totalSeats - 12} seats left</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {step === 2 && selectedRoute && (
        <div className="bg-white rounded-xl shadow-xl p-6 sm:p-10 animate-fade-in">
          <button onClick={() => setStep(1)} className="text-sm text-gray-500 mb-4 hover:text-brand-600">&larr; Back to results</button>
          <h2 className="text-2xl font-bold mb-6">Passenger Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="John"
                  value={passenger.firstName}
                  onChange={e => setPassenger({...passenger, firstName: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <div className="relative">
                 <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="Doe"
                  value={passenger.lastName}
                  onChange={e => setPassenger({...passenger, lastName: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="john.doe@example.com"
                value={passenger.email}
                onChange={e => setPassenger({...passenger, email: e.target.value})}
              />
            </div>
          </div>

          <div className="mt-8">
            <button 
              onClick={() => {
                if(passenger.firstName && passenger.lastName && passenger.email) setStep(3);
                else alert("Please fill all fields");
              }}
              className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      )}

      {step === 3 && selectedRoute && (
        <div className="bg-white rounded-xl shadow-xl p-6 sm:p-10 animate-fade-in">
          <button onClick={() => setStep(2)} className="text-sm text-gray-500 mb-4 hover:text-brand-600">&larr; Back to details</button>
          <h2 className="text-2xl font-bold mb-6">Payment</h2>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">Order Summary</h3>
            <div className="flex justify-between text-sm mb-1">
              <span>{selectedRoute.origin} to {selectedRoute.destination}</span>
              <span className="font-medium">${selectedRoute.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Booking Fee</span>
              <span className="font-medium">$2.00</span>
            </div>
            <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${(selectedRoute.price + 2).toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-4 mb-8 opacity-50 pointer-events-none">
             {/* Mock Payment Form - Visual only */}
             <div className="border p-4 rounded flex items-center gap-3">
                <CreditCard className="w-6 h-6" />
                <span className="font-mono">**** **** **** 4242</span>
             </div>
          </div>

          <button 
            onClick={handleBook}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-500/30 flex justify-center items-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            Pay & Confirm Booking
          </button>
          <p className="text-xs text-center text-gray-400 mt-4">This is a mock application. No real payment will be processed.</p>
        </div>
      )}
    </div>
  );
};