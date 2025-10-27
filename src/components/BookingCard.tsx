import { Calendar, Clock, Users } from 'lucide-react';

interface BookingCardProps {
  id: string;
  venueName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  attendees: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  showActions?: boolean;
  onCancel?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export default function BookingCard({
  id,
  venueName,
  date,
  startTime,
  endTime,
  attendees,
  status,
  showActions = false,
  onCancel,
  onApprove,
  onReject,
}: BookingCardProps) {
  const statusColors = {
    pending: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    confirmed: 'bg-green-500/10 text-green-700 dark:text-green-400',
    cancelled: 'bg-red-500/10 text-red-700 dark:text-red-400',
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3>{venueName}</h3>
          </div>
          <span className={`px-3 py-1 rounded-md text-sm ${statusColors[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
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
            <span className="text-sm">{startTime} - {endTime}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-sm">{attendees} attendees</span>
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2 mt-4">
            {status === 'pending' && onApprove && onReject && (
              <>
                <button
                  className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  onClick={() => onApprove(id)}
                >
                  Approve
                </button>
                <button
                  className="flex-1 px-3 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
                  onClick={() => onReject(id)}
                >
                  Reject
                </button>
              </>
            )}
            
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
