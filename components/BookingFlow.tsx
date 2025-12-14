import React, { useState, useEffect } from 'react';
import { BusRoute, Booking, BookingStatus, Passenger } from '../types';
import { CITIES, MOCK_ROUTES } from '../constants';
import { getDestinationInsights } from '../services/geminiService';
import { Search, MapPin, Calendar, ArrowRight, User, CreditCard, Sparkles, Armchair, Check } from 'lucide-react';

interface BookingFlowProps {
  onBookingComplete: (booking: Booking) => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({ onBookingComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [searchParams, setSearchParams] = useState({ origin: 'Paris', destination: 'Lyon', date: '' });
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [passenger, setPassenger] = useState<Passenger>({ firstName: '', lastName: '', email: '' });
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [occupiedSeats, setOccupiedSeats] = useState<number[]>([]);

  // Fetch AI insights when destination changes
  useEffect(() => {
    const fetchInsight = async () => {
      setLoadingAi(true);
      const text = await getDestinationInsights(searchParams.destination);
      setAiInsight(text);
      setLoadingAi(false);
    };
    
    if(searchParams.destination) {
      const timer = setTimeout(fetchInsight, 800);
      return () => clearTimeout(timer);
    }
  }, [searchParams.destination]);

  // Simulate fetching occupied seats when a route is selected
  useEffect(() => {
    if (selectedRoute) {
      // Generate some random occupied seats for the demo
      const randomOccupied = Array.from({ length: 15 }, () => Math.floor(Math.random() * selectedRoute.totalSeats) + 1);
      setOccupiedSeats(randomOccupied);
      setSelectedSeat(null);
    }
  }, [selectedRoute]);

  const filteredRoutes = MOCK_ROUTES.filter(
    (r) => r.origin === searchParams.origin && r.destination === searchParams.destination
  );

  const handleBook = () => {
    if (!selectedRoute || !selectedSeat) return;
    
    const newBooking: Booking = {
      id: `BK${Math.floor(Math.random() * 900000) + 100000}`,
      routeId: selectedRoute.id,
      passenger,
      status: BookingStatus.CONFIRMED,
      bookingDate: new Date().toISOString(),
      seatNumber: selectedSeat
    };
    
    setTimeout(() => {
      onBookingComplete(newBooking);
    }, 1500);
  };

  const renderSeatMap = () => {
    if (!selectedRoute) return null;
    const totalSeats = selectedRoute.totalSeats;
    const rows = Math.ceil(totalSeats / 4);
    
    return (
      <div className="flex flex-col items-center animate-fade-in">
        <div className="w-full max-w-sm bg-gray-100 rounded-t-3xl border-x-8 border-t-8 border-gray-300 p-8 pb-12 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-6 bg-gray-800 text-white text-xs px-3 py-1 rounded-full uppercase tracking-wider">Front</div>
          <div className="grid grid-cols-5 gap-3">
             {/* Aisle is column 3 */}
             {Array.from({ length: rows }).map((_, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  {[1, 2, 3, 4].map((colIndex) => {
                    if (colIndex === 3) return <div key={`aisle-${rowIndex}`} className="w-8"></div>; // Aisle
                    
                    // Calculate seat number: 
                    // Row 0: 1, 2, ais, 3, 4
                    // Row 1: 5, 6, ais, 7, 8
                    let seatNum = (rowIndex * 4) + (colIndex > 2 ? colIndex - 1 : colIndex);
                    
                    if (seatNum > totalSeats) return <div key={`empty-${seatNum}`} className="w-8"></div>;

                    const isOccupied = occupiedSeats.includes(seatNum);
                    const isSelected = selectedSeat === seatNum;

                    return (
                      <button
                        key={seatNum}
                        disabled={isOccupied}
                        onClick={() => setSelectedSeat(seatNum)}
                        className={`
                          w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all transform
                          ${isOccupied 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : isSelected 
                              ? 'bg-brand-600 text-white shadow-lg scale-110 ring-2 ring-brand-300' 
                              : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-brand-500 hover:text-brand-600'}
                        `}
                      >
                        {isSelected ? <Check className="w-4 h-4" /> : seatNum}
                      </button>
                    );
                  })}
                </React.Fragment>
             ))}
          </div>
        </div>
        
        <div className="flex gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-white border-2 border-gray-200"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-brand-600"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-300"></div>
            <span>Occupied</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative z-0">
           <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10" />
           {[
             { num: 1, label: 'Route' },
             { num: 2, label: 'Seat' },
             { num: 3, label: 'Details' },
             { num: 4, label: 'Pay' }
           ].map((s) => (
             <div key={s.num} className={`flex flex-col items-center bg-gray-50 px-2 ${step >= s.num ? 'text-brand-600' : 'text-gray-400'}`}>
               <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-1 transition-colors ${step >= s.num ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                 {step > s.num ? <Check className="w-4 h-4" /> : s.num}
               </div>
               <span className="text-xs font-medium">{s.label}</span>
             </div>
           ))}
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 animate-fade-in border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Where to next?</h2>
            <p className="text-gray-500">Book your tickets comfortably and securely.</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Origin</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 text-gray-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />
                  <select 
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none appearance-none font-medium text-gray-700 transition-shadow"
                    value={searchParams.origin}
                    onChange={(e) => setSearchParams({...searchParams, origin: e.target.value})}
                  >
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="relative group">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 text-brand-500 w-5 h-5" />
                  <select 
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none appearance-none font-medium text-gray-700 transition-shadow"
                    value={searchParams.destination}
                    onChange={(e) => setSearchParams({...searchParams, destination: e.target.value})}
                  >
                    {CITIES.filter(c => c !== searchParams.origin).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insight Box */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-0.5 mb-8 shadow-sm">
             <div className="bg-white rounded-[10px] p-4 flex items-start gap-4">
                <div className="bg-indigo-50 p-2 rounded-lg">
                   <Sparkles className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-1">Gemini AI Travel Tip</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {loadingAi ? 'Generating insights for you...' : aiInsight}
                  </p>
                </div>
             </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
              Available Routes 
              <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{filteredRoutes.length} found</span>
            </h3>
            {filteredRoutes.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                No routes found for this route. Try switching the cities.
              </div>
            ) : (
              filteredRoutes.map(route => (
                <div 
                  key={route.id}
                  onClick={() => { setSelectedRoute(route); setStep(2); }}
                  className="group border border-gray-200 rounded-xl p-5 hover:border-brand-500 hover:shadow-lg hover:shadow-brand-500/10 cursor-pointer transition-all bg-white relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="-rotate-45 text-brand-500 w-6 h-6" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{new Date(route.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        <div className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full mt-1">{route.origin}</div>
                      </div>
                      <div className="flex flex-col items-center">
                         <div className="text-xs text-gray-400 mb-1">2h 00m</div>
                         <div className="w-24 h-0.5 bg-gray-200 relative">
                            <div className="absolute right-0 -top-1 w-2 h-2 rounded-full bg-gray-300"></div>
                            <div className="absolute left-0 -top-1 w-2 h-2 rounded-full bg-gray-300"></div>
                         </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{new Date(route.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                         <div className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full mt-1">{route.destination}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-4 sm:pt-0 mt-2 sm:mt-0">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Bus <span className="font-mono text-gray-700">{route.busNumber}</span></div>
                        <div className="text-xs text-green-600 font-medium flex items-center gap-1 justify-end">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          WiFi & AC
                        </div>
                      </div>
                      <div className="text-right pl-4 border-l border-gray-100">
                        <div className="text-2xl font-black text-brand-600">${route.price}</div>
                        <div className="text-[10px] text-gray-400 font-medium">per person</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {step === 2 && selectedRoute && (
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 animate-fade-in border border-gray-100">
           <div className="flex items-center justify-between mb-8">
              <button onClick={() => setStep(1)} className="text-sm font-medium text-gray-500 hover:text-brand-600 flex items-center gap-1 transition-colors">
                <ArrowRight className="w-4 h-4 rotate-180" /> Change Route
              </button>
              <h2 className="text-2xl font-bold text-gray-900">Select your seat</h2>
              <div className="w-20"></div> {/* spacer */}
           </div>

           <div className="flex flex-col lg:flex-row gap-12 justify-center">
              <div className="flex-1">
                 {renderSeatMap()}
              </div>
              
              <div className="lg:w-72 flex flex-col justify-center">
                 <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-4">Selected Seat</h3>
                    {selectedSeat ? (
                       <div className="text-center py-6">
                          <div className="text-6xl font-black text-brand-600 mb-2">{selectedSeat}</div>
                          <p className="text-gray-500 text-sm">Window / Aisle</p>
                          <div className="mt-6 pt-6 border-t border-gray-200">
                             <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-500">Seat Price</span>
                                <span className="font-bold text-gray-900">${selectedRoute.price}</span>
                             </div>
                             <button 
                               onClick={() => setStep(3)}
                               className="w-full mt-4 bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20"
                             >
                               Confirm Seat
                             </button>
                          </div>
                       </div>
                    ) : (
                       <div className="text-center py-10 text-gray-400">
                          <Armchair className="w-12 h-12 mx-auto mb-3 opacity-20" />
                          <p>Click on a seat to select it.</p>
                       </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}

      {step === 3 && selectedRoute && (
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 animate-fade-in border border-gray-100 max-w-2xl mx-auto">
          <button onClick={() => setStep(2)} className="text-sm font-medium text-gray-500 mb-6 hover:text-brand-600 flex items-center gap-1 transition-colors">
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to seats
          </button>
          
          <h2 className="text-2xl font-bold mb-8 text-gray-900">Passenger Details</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 text-gray-400 w-5 h-5" />
                    <input 
                      type="text" 
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                      placeholder="John"
                      value={passenger.firstName}
                      onChange={e => setPassenger({...passenger, firstName: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 text-gray-400 w-5 h-5" />
                    <input 
                      type="text" 
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                      placeholder="Doe"
                      value={passenger.lastName}
                      onChange={e => setPassenger({...passenger, lastName: e.target.value})}
                    />
                  </div>
                </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                placeholder="john.doe@example.com"
                value={passenger.email}
                onChange={e => setPassenger({...passenger, email: e.target.value})}
              />
              <p className="text-xs text-gray-400 mt-2">Your ticket will be sent to this email.</p>
            </div>
          </div>

          <div className="mt-10">
            <button 
              onClick={() => {
                if(passenger.firstName && passenger.lastName && passenger.email) setStep(4);
                else alert("Please fill all fields");
              }}
              className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-xl shadow-brand-500/20 flex justify-center items-center gap-2"
            >
              Continue to Payment
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {step === 4 && selectedRoute && selectedSeat && (
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 animate-fade-in border border-gray-100 max-w-2xl mx-auto">
          <button onClick={() => setStep(3)} className="text-sm font-medium text-gray-500 mb-6 hover:text-brand-600 flex items-center gap-1 transition-colors">
            <ArrowRight className="w-4 h-4 rotate-180" /> Edit Details
          </button>
          
          <h2 className="text-2xl font-bold mb-8 text-gray-900">Review & Pay</h2>
          
          <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100 mb-8">
            <h3 className="font-bold text-brand-900 mb-4 flex items-center gap-2">
              <Check className="w-5 h-5 text-brand-600" />
              Trip Summary
            </h3>
            <div className="space-y-3 text-sm">
               <div className="flex justify-between">
                  <span className="text-brand-700/70">Route</span>
                  <span className="font-medium text-brand-900">{selectedRoute.origin} <span className="text-brand-400">to</span> {selectedRoute.destination}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-brand-700/70">Date & Time</span>
                  <span className="font-medium text-brand-900">{new Date(selectedRoute.departureTime).toLocaleString()}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-brand-700/70">Seat</span>
                  <span className="font-medium text-brand-900">#{selectedSeat}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-brand-700/70">Passenger</span>
                  <span className="font-medium text-brand-900">{passenger.firstName} {passenger.lastName}</span>
               </div>
               
               <div className="h-px bg-brand-200 my-4"></div>
               
               <div className="flex justify-between text-base">
                  <span className="text-brand-800">Total Price</span>
                  <span className="font-bold text-brand-900 text-lg">${selectedRoute.price.toFixed(2)}</span>
               </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
             <div className="p-4 border border-gray-200 rounded-xl flex items-center gap-4 bg-white hover:border-brand-500 cursor-pointer transition-colors shadow-sm">
                <div className="p-2 bg-gray-100 rounded-lg">
                    <CreditCard className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                    <p className="font-bold text-gray-900">Credit Card</p>
                    <p className="text-xs text-gray-500">Mastercard ending in 4242</p>
                </div>
                <div className="w-4 h-4 rounded-full border-2 border-brand-500 bg-brand-500"></div>
             </div>
          </div>

          <button 
            onClick={handleBook}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all hover:scale-[1.01] shadow-xl shadow-green-500/20 flex justify-center items-center gap-2"
          >
            <span className="flex items-center gap-2">Pay ${selectedRoute.price.toFixed(2)}</span>
          </button>
          
          <p className="text-xs text-center text-gray-400 mt-6 flex items-center justify-center gap-1">
             <Check className="w-3 h-3" /> Secure SSL Encryption
          </p>
        </div>
      )}
    </div>
  );
};