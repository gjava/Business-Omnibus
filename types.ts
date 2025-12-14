export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  CANCELLED = 'CANCELLED'
}

export interface BusRoute {
  id: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  totalSeats: number;
  busNumber: string;
}

export interface Passenger {
  firstName: string;
  lastName: string;
  email: string;
}

export interface Booking {
  id: string;
  routeId: string;
  passenger: Passenger;
  status: BookingStatus;
  bookingDate: string;
  seatNumber: number;
}

export type ViewState = 'HOME' | 'BOOKING' | 'TICKET' | 'ADMIN';
