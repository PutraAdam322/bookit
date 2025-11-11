import { Calendar, Clock, Users } from 'lucide-react';
import type { BookingSlot, Booking } from '@/interface/interface';

const getTime = (datetime:string) => {
  const [, tmp] = datetime.split("T");
  const [h, ] = tmp.split("+");
  return h.slice(0,5);
}

const getDate = (datetime:string) => {
  const [tmp, ] = datetime.split("T");
  const [y, m, d ] = tmp.split("-");
  return `${d}-${m}-${y}`;
}

export default function BookingCard({
booking_slot, status, showActions, onCancel, id}: Booking) {
  const statusColors = {
    pending: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    confirmed: 'bg-green-500/10 text-green-700 dark:text-green-400',
    cancelled: 'bg-red-500/10 text-red-700 dark:text-red-400',
  }

  const startTime = ((booking_slot.end_time));
  const endTime= ((booking_slot.start_time));
  const h0 = getTime(startTime);
  const h1 = getTime(endTime);
  const date = getDate(startTime)


  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3>{booking_slot.facility.name}</h3>
          </div>
          {<span className={`px-3 py-1 rounded-md text-sm ${statusColors[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>}
        </div>
      </div>
      
      <div className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{date}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{h1} - {h0}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-sm">{booking_slot.facility.capacity} Capacity</span>
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2 mt-4">        
            {status === 'confirmed' && onCancel && (
              <button
                className="w-full px-3 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                onClick={() => onCancel(id)}
              >
                Cancel Booking
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
