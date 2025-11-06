// src/routes/facilities/$id.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react';
import { Users, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import { queryOptions, useSuspenseQuery, useMutation } from '@tanstack/react-query'
import Placeholder from '@/visuals/placeholder.jpg'
import { getAccessToken } from '@/auth';




const facilityQuery = (id: string) => queryOptions({
  queryKey: ['facility', id],
  queryFn: async ({ signal }: { signal?: AbortSignal }) => {
    const token = getAccessToken()
    const res = await fetch(`https://bookit-backend-d4l7.onrender.com/api/v1/facilities/${id}`, {
      method: 'GET',
      signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    })
    if (!res.ok) {
      throw new Error('Facility not found')
    }
    return res.json()
  },
})


const userQuery = () => queryOptions({
  queryKey: ['user'],
  queryFn: async () => {
    const token = getAccessToken()
    const res = await fetch(`https://bookit-backend-d4l7.onrender.com/api/v1/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    })
    if (!res.ok) throw new Error('Unauthorized')
    return res.json()
  },
})

export const Route = createFileRoute('/facilities/$id')({
  component: RouteComponent,
  loader: ({ context, params }) => {
    return context.queryClient.ensureQueryData(facilityQuery(params.id))
  },
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { data } = useSuspenseQuery(facilityQuery(id))
  const user = useSuspenseQuery(userQuery())

  const [selectedDay, setSelectedDay] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const navigate = useNavigate();

  if(data.status === 401 || data.status === 400){
    navigate({to:"/login"})
  }

  const groupedByDay = data.BookingSlots.reduce((acc: Record<string, any[]>, slot:any) => {
    const date = new Date(slot.start_time).toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {});

  const days = Object.keys(groupedByDay).filter((day) => {
    const d = new Date(day);
    const weekday = d.getDay();
    return weekday === 0 || weekday === 6;
  });

  
const mutation = useMutation({
  mutationFn: async ({ bookingslotId, totalPrice }: { bookingslotId: number; totalPrice: number }) => {
    const res = await fetch(`http://localhost:8080/api/v1/bookings/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAccessToken(),
      },
      body: JSON.stringify({ 'booking_slot_id':bookingslotId, 'total_price':totalPrice }),
    });

    const text = await res.text(); // debug raw response
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`Invalid JSON response: ${text}`);
    }
  },
  onSuccess: () => {
    alert('Booking successful!');
  },
  onError: (err) => {
    console.error('Booking failed:', err);
    alert('Booking failed: ' + err.message);
  },
})

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotId) {
      alert('Please choose a time slot');
      return;
    }

    const totalPrice = data.price;
    mutation.mutate({ bookingslotId: selectedSlotId, totalPrice });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isAdmin={user?.data?.isAdmin} />

      <div className="container mx-auto px-4 py-8">
        <i className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to facilities
        </i>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <img
                src={Placeholder}
                alt="Placeholder"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="mb-2">{data.name}</h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>Up to {data.capacity} people</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">
                A spacious and modern facility perfect for competition, fun games, and healthy sports. Equipped with state-of-the-art feature equipment and clean facility.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-2">Pricing</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-muted-foreground">Starting from</span>
                <span className="text-3xl">${data.price}</span>
                <span className="text-muted-foreground">/hour</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Minimum booking of 2 hours required
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-lg border border-border bg-card p-6 sticky top-8">
              <h3 className="mb-4">Book This Venue</h3>
               <form onSubmit={handleBooking}>
                <div className="space-y-2">
                  <label>Day</label>
                  <select
                    value={selectedDay}
                    onChange={(e) => {
                      setSelectedDay(e.target.value);
                      setSelectedSlotId(null);
                    }}
                    className="w-full border p-2 rounded"
                    required
                  >
                    <option value="">Select day</option>
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedDay && (
                  <div className="space-y-2">
                    <label>Available Time Slots</label>
                    <select
                      value={selectedSlotId ?? ''}
                      onChange={(e) => setSelectedSlotId(Number(e.target.value))}
                      className="w-full border p-2 rounded"
                      required
                    >
                      <option value="">Select time slot</option>
                      {groupedByDay[selectedDay]
                        .filter((slot:any) => slot.is_available)
                        .map((slot:any) => (
                          <option key={slot.id} value={slot.id}>
                            {new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
                            {new Date(slot.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="bg-primary text-white w-full py-2 rounded mt-4"
                >
                  {mutation.isPending ? 'Booking...' : 'Request Booking'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RouteComponent
