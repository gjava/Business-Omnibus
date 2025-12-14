import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { BookingFlow } from './components/BookingFlow';
import { TicketView } from './components/TicketView';
import { AdminDashboard } from './components/AdminDashboard';
import { Booking, BookingStatus, ViewState } from './types';

// Initial dummy data for demonstration
const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: 'bk_demo_1',
    routeId: 'rt_001', // Paris -> Lyon
    passenger: { firstName: 'Alice', lastName: 'Dubois', email: 'alice@example.com' },
    status: BookingStatus.CONFIRMED,
    bookingDate: new Date().toISOString(),
    seatNumber: 12
  },
  {
    id: 'bk_demo_2',
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
      case 'BOOKING':
        return <BookingFlow onBookingComplete={handleBookingComplete} />;
      case 'TICKET':
        return <TicketView bookings={bookings} />;
      case 'ADMIN':
        return (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={resetData} className="text-xs text-red-500 underline hover:text-red-700">
                Reset Demo Data
              </button>
            </div>
            <AdminDashboard bookings={bookings} updateBookingStatus={updateBookingStatus} />
          </div>
        );
      default:
        return <BookingFlow onBookingComplete={handleBookingComplete} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView}>
      {renderContent()}
    </Layout>
  );
}