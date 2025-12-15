import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { BookingFlow } from './components/BookingFlow';
import { TicketView } from './components/TicketView';
import { AdminDashboard } from './components/AdminDashboard';
import { Booking, BookingStatus, ViewState } from './types';

// Initial dummy data for demonstration
const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: 'BK82910',
    routeId: 'rt_001', // Paris -> Lyon
    passenger: { firstName: 'Alice', lastName: 'Dubois', email: 'alice@example.com' },
    status: BookingStatus.CONFIRMED,
    bookingDate: new Date().toISOString(),
    seatNumber: 12
  },
  {
    id: 'BK10922',
    routeId: 'rt_001',
    passenger: { firstName: 'Bob', lastName: 'Martin', email: 'bob@example.com' },
    status: BookingStatus.CHECKED_IN,
    bookingDate: new Date().toISOString(),
    seatNumber: 14
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  
  // Initialize bookings from LocalStorage if available, otherwise use defaults
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('omnibus_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse bookings", e);
        return DEFAULT_BOOKINGS;
      }
    }
    return DEFAULT_BOOKINGS;
  });

  // Save to LocalStorage whenever bookings change
  useEffect(() => {
    localStorage.setItem('omnibus_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const handleBookingComplete = (newBooking: Booking) => {
    setBookings(prev => [...prev, newBooking]);
    setCurrentView('TICKET');
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => 
      b.id === id ? { ...b, status } : b
    ));
  };

  // Admin function to reset data for a fresh demo
  const resetData = () => {
    if(confirm("Reset all data to default demo state?")) {
      setBookings(DEFAULT_BOOKINGS);
      localStorage.removeItem('omnibus_bookings');
    }
  }

  const renderContent = () => {
    switch(currentView) {
      case 'HOME':
        return <LandingPage setView={setCurrentView} />;
      case 'BOOKING':
        return <BookingFlow onBookingComplete={handleBookingComplete} />;
      case 'TICKET':
        return <TicketView bookings={bookings} />;
      case 'ADMIN':
        return (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
               <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
               <button onClick={resetData} className="px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200">
                Reset System Data
              </button>
            </div>
            <AdminDashboard bookings={bookings} updateBookingStatus={updateBookingStatus} />
          </div>
        );
      default:
        return <LandingPage setView={setCurrentView} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView}>
      {renderContent()}
    </Layout>
  );
}