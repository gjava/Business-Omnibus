import React, { useState } from 'react';
import { Booking, BookingStatus } from '../types';
import { MOCK_ROUTES } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CheckCircle, XCircle, Search, Users, TrendingUp } from 'lucide-react';

interface AdminDashboardProps {
  bookings: Booking[];
  updateBookingStatus: (id: string, status: BookingStatus) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ bookings, updateBookingStatus }) => {
  const [scanId, setScanId] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState(MOCK_ROUTES[0].id);

  // Filter bookings for the selected route
  const manifest = bookings.filter(b => b.routeId === selectedRouteId);
  const selectedRoute = MOCK_ROUTES.find(r => r.id === selectedRouteId);

  // Analytics Data
  const data = MOCK_ROUTES.map(route => {
    const count = bookings.filter(b => b.routeId === route.id).length;
    return {
      name: route.destination,
      passengers: count,
      capacity: route.totalSeats
    };
  });

  const handleScan = () => {
    const booking = bookings.find(b => b.id === scanId);
    if (booking) {
      updateBookingStatus(booking.id, BookingStatus.CHECKED_IN);
      setScanId('');
      alert(`Success! Checked in ${booking.passenger.firstName} ${booking.passenger.lastName}`);
    } else {
      alert("Booking ID not found.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Passengers</p>
              <h3 className="text-2xl font-bold">{bookings.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Boarded / Checked-in</p>
              <h3 className="text-2xl font-bold">{bookings.filter(b => b.status === BookingStatus.CHECKED_IN).length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Revenue (Est.)</p>
              <h3 className="text-2xl font-bold">${bookings.reduce((acc, b) => {
                 const r = MOCK_ROUTES.find(route => route.id === b.routeId);
                 return acc + (r ? r.price : 0);
              }, 0)}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Embarkation Control */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Embarkation Manifest</h2>
            <select 
              className="border rounded-md px-3 py-1 text-sm"
              value={selectedRouteId}
              onChange={(e) => setSelectedRouteId(e.target.value)}
            >
              {MOCK_ROUTES.map(r => (
                <option key={r.id} value={r.id}>{r.origin} &rarr; {r.destination} ({r.busNumber})</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 mb-6">
            <input 
              type="text" 
              placeholder="Scan Ticket ID (Enter ID manually)" 
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
              value={scanId}
              onChange={(e) => setScanId(e.target.value)}
            />
            <button 
              onClick={handleScan}
              className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700"
            >
              Check-in
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 font-medium">Seat</th>
                  <th className="px-4 py-3 font-medium">Passenger</th>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {manifest.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No passengers found for this route.</td></tr>
                ) : (
                  manifest.map(booking => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono font-bold text-brand-600">{booking.seatNumber}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{booking.passenger.lastName}, {booking.passenger.firstName}</div>
                        <div className="text-xs text-gray-400">{booking.passenger.email}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{booking.id}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          booking.status === BookingStatus.CHECKED_IN ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status === BookingStatus.CHECKED_IN ? 'Boarded' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {booking.status !== BookingStatus.CHECKED_IN && (
                          <button 
                            onClick={() => updateBookingStatus(booking.id, BookingStatus.CHECKED_IN)}
                            className="text-brand-600 hover:text-brand-900 font-medium text-xs"
                          >
                            Board
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Occupancy Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Occupancy Overview</h2>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                  cursor={{fill: '#f3f4f6'}}
                />
                <Bar dataKey="passengers" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};