import { BusRoute } from './types';

export const CITIES = [
  'Paris',
  'Lyon',
  'Marseille',
  'Bordeaux',
  'Lille',
  'Strasbourg',
  'Nantes'
];

export const MOCK_ROUTES: BusRoute[] = [
  {
    id: 'rt_001',
    origin: 'Paris',
    destination: 'Lyon',
    departureTime: '2023-11-25T08:00:00',
    arrivalTime: '2023-11-25T10:00:00',
    price: 45,
    totalSeats: 50,
    busNumber: 'OM-101'
  },
  {
    id: 'rt_002',
    origin: 'Paris',
    destination: 'Bordeaux',
    departureTime: '2023-11-25T09:30:00',
    arrivalTime: '2023-11-25T12:45:00',
    price: 55,
    totalSeats: 50,
    busNumber: 'OM-102'
  },
  {
    id: 'rt_003',
    origin: 'Lyon',
    destination: 'Marseille',
    departureTime: '2023-11-25T14:00:00',
    arrivalTime: '2023-11-25T16:00:00',
    price: 30,
    totalSeats: 40,
    busNumber: 'OM-204'
  },
  {
    id: 'rt_004',
    origin: 'Lille',
    destination: 'Paris',
    departureTime: '2023-11-26T07:00:00',
    arrivalTime: '2023-11-26T08:00:00',
    price: 25,
    totalSeats: 60,
    busNumber: 'OM-305'
  }
];
