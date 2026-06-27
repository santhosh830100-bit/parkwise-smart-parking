export type SlotType = 'standard' | 'ev' | 'disabled';
export type SlotStatus = 'available' | 'booked';

export interface ParkingSlot {
  id: string;
  label: string;
  status: SlotStatus;
  type: SlotType;
  pricePerHour: number;
}

export interface BookingDetails {
  name: string;
  vehicleNumber: string;
  startTime: string;
  endTime: string;
}

export type PaymentStep = 'idle' | 'summary' | 'processing' | 'success';

export interface BookingSummary {
  slot: ParkingSlot;
  details: BookingDetails;
  hours: number;
  totalPrice: number;
  transactionId?: string;
}

export interface Destination {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface VehicleType {
  id: string;
  label: string;
  size: string;
}

export interface ParkingLocation {
  id: string;
  name: string;
  availableSlots: number;
  totalSlots: number;
  vehicleSupport: string[];
  status: 'free' | 'paid';
  latitude: number;
  longitude: number;
  area: string;
  distance?: number;
  aiScore?: number;
  compatible?: boolean;
  breakdown?: {
    destinationMatchScore: number;
    distanceScore: number;
    availabilityScore: number;
    vehicleMatchScore: number;
    freeBonus: number;
  };
}

export interface NoParkingZone {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number][];
}

