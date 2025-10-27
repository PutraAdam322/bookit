import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import Header from '@/components/Header';
import BookingCard from '@/components/BookingCard';

const MOCK_BOOKINGS = [
  {
    id: '1',
    venueName: 'Grand Conference Hall',
    date: 'March 15, 2024',
    startTime: '2:00 PM',
    endTime: '4:00 PM',
    location: 'Building A, 5th Floor',
    attendees: 45,
    status: 'confirmed' as const,
  },
  {
    id: '2',
    venueName: 'Executive Meeting Room',
    date: 'March 18, 2024',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    location: 'Building B, 3rd Floor',
    attendees: 12,
    status: 'pending' as const,
  },
  {
    id: '3',
    venueName: 'Training Room Alpha',
    date: 'March 20, 2024',
    startTime: '1:00 PM',
    endTime: '5:00 PM',
    location: 'Building B, 2nd Floor',
    attendees: 30,
    status: 'pending' as const,
  },
  {
    id: '4',
    venueName: 'Event Auditorium',
    date: 'February 28, 2024',
    startTime: '6:00 PM',
    endTime: '9:00 PM',
    location: 'Building C, Ground Floor',
    attendees: 150,
    status: 'confirmed' as const,
  },
  {
    id: '5',
    venueName: 'Boardroom Suite',
    date: 'February 20, 2024',
    startTime: '3:00 PM',
    endTime: '5:00 PM',
    location: 'Building A, 10th Floor',
    attendees: 8,
    status: 'cancelled' as const,
  },
];

export const Route = createFileRoute('/my-bookings')({
  component: RouteComponent,
})

function RouteComponent() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [bookings] = useState(MOCK_BOOKINGS);

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'pending'
  );
  const pastBookings = bookings.filter(
    (b) => b.status === 'cancelled' || new Date(b.date) < new Date()
  );

  const handleCancelBooking = (id: string) => {
    alert(`Cancelling booking ${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="user" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2">My Bookings</h1>
          <p className="text-muted-foreground">
            View and manage your venue reservations
          </p>
        </div>

        {/* Tabs */}
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

        {/* Tab Content */}
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
                {upcomingBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    {...booking}
                    showActions={true}
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
                {pastBookings.map((booking) => (
                  <BookingCard key={booking.id} {...booking} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
