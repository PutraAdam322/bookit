import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import Header from '@/components/Header';
import BookingCard from '@/components/BookingCard';
import { queryOptions, useSuspenseQuery, useMutation } from '@tanstack/react-query';
import { getAccessToken } from '@/utils/utils';
import type { Booking } from '@/interface/interface';
import UnauthorizedHandling from '@/components/UnauthorizedHandling';

const url = import.meta.env.VITE_API_URL

const bookingQuery = () => queryOptions({
  queryKey: ['bookings'],
  queryFn: async () => {
    const token = getAccessToken()
    const res = await fetch(`${url}/api/v1/bookings/mybook`, 
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message)
    }
    return res.json()
  },
})

export const Route = createFileRoute('/my-bookings')({
  component: RouteComponent,
  loader: ({ context }) => {
    return context.queryClient.ensureQueryData(bookingQuery())
  },
  errorComponent: ({}) => (
    <UnauthorizedHandling />
  ),
})

function RouteComponent() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const { data } = useSuspenseQuery(bookingQuery())
  const navigate = useNavigate();


  const mutation = useMutation({
    mutationFn: async (bid:number) => {
      const res = await fetch(`${url}/api/v1/bookings/${bid}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAccessToken(),
        }
      });

      const text = await res.text(); // debug raw response
      try {
        return JSON.parse(text);
      } catch {
        throw new Error(`Invalid JSON response: ${text}`);
      }
    },
    onSuccess: () => {
      alert('cancel successful!');
      navigate({to:"/my-bookings"})
    },
    onError: (err) => {
      console.error('Booking failed:', err);
      alert('cancel failed: ' + err.message);
    },
  })

  const upcomingBookings = data.data.filter(
    (b : Booking) => new Date(b.booking_slot.end_time) > new Date() && b.status != "cancelled"
  );
  const pastBookings = data.data.filter(
    (b : Booking) => new Date(b.booking_slot.end_time) < new Date() || b.status == "cancelled"
  );

  const handleCancelBooking = (bid: number) => {
    mutation.mutate(bid)
    alert(`Cancelling booking ${bid}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isAdmin={false} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2">My Bookings</h1>
          <p className="text-muted-foreground">
            View and manage your venue reservations
          </p>
        </div>

        <div className="mb-6 border-b border-border">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`pb-3 px-1 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'upcoming'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Calendar className="h-4 w-4" />
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`pb-3 px-1 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'past'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Clock className="h-4 w-4" />
              Past
            </button>
          </div>
        </div>

        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="mb-2">No Upcoming Bookings</h3>
                <p className="text-muted-foreground">
                  You don't have any upcoming venue reservations
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingBookings.map((booking : Booking) => (
                  <BookingCard
                    key={booking.id}
                    {...booking}
                    showActions={true}
                    status={booking.status}
                    onCancel={handleCancelBooking}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'past' && (
          <div className="space-y-4">
            {pastBookings.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="mb-2">No Past Bookings</h3>
                <p className="text-muted-foreground">
                  You don't have any past venue reservations
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastBookings.map((booking : any) => (
                  <BookingCard key={booking.id} {...booking} booking_slot={booking.booking_slot} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
