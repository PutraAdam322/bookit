export interface Facility {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  id: number;
  name?: string;
  price?: number;
  capacity?: number;
  available?: boolean;
}

export interface Response<T> {
  message: string;
  data: T;
}


export interface BookingSlot {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  id: number;
  facility_id: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  facility: Facility;
}

export interface User {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  id: number;
  name?: string;
  email?: string;
}

export interface Booking {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  id: number;
  total_price: number;
  status: | 'pending' | 'confirmed' | 'cancelled';
  user_id: number;
  booking_slot_id: number;
  booking_slot: BookingSlot;
  user: User;
  showActions?: boolean;
  onCancel?: (id: number) => void;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
}

export interface BookingResponse {
  message: string;
  data: Booking[];
}

/** Props for BookingCard component */
export interface BookingCardProps {
  bookingSlot: BookingSlot;
  bookingId: number;
  showActions?: boolean;
  onCancel?: (id: number) => void;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
}