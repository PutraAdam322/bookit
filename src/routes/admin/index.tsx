import { createFileRoute } from '@tanstack/react-router'
import { Calendar, Building2, Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import BookingCard from '@/components/BookingCard';
import type { Booking } from '@/interface/interface';

const STATS = [
  {
    title: 'Total Venues',
    value: '12',
    change: '+2 this month',
    icon: Building2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-950',
  },
  {
    title: 'Total Bookings',
    value: '248',
    change: '+18% from last month',
    icon: Calendar,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-950',
  },
  {
    title: 'Pending Requests',
    value: '7',
    change: 'Requires attention',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 dark:bg-yellow-950',
  },
  {
    title: 'Active Users',
    value: '156',
    change: '+12% this month',
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-950',
  },
];

const RECENT_BOOKINGS: Booking[] = [
  {
    ID: 1,
    CreatedAt: "2024-03-17T08:00:00.000Z",
    UpdatedAt: "2024-03-17T08:00:00.000Z",
    DeletedAt: null,
    id: 1,
    total_price: 150.0,
    status: "pending",
    user_id: 101,
    booking_slot_id: 201,
    booking_slot: {
      ID: 201,
      CreatedAt: "2024-03-01T00:00:00.000Z",
      UpdatedAt: "2024-03-01T00:00:00.000Z",
      DeletedAt: null,
      id: 201,
      facility_id: 301,
      start_time: "2024-03-17T14:00:00.000Z",
      end_time: "2024-03-17T16:00:00.000Z",
      is_available: false,
      facility: {
        ID: 301,
        CreatedAt: "2023-12-01T00:00:00.000Z",
        UpdatedAt: "2024-01-01T00:00:00.000Z",
        DeletedAt: null,
        id: 301,
        name: "Grand Conference Hall",
        price: 150,
        capacity: 60,
        available: true,
      },
    },
    user: {
      ID: 101,
      CreatedAt: "2022-05-10T00:00:00.000Z",
      UpdatedAt: "2024-02-15T00:00:00.000Z",
      DeletedAt: null,
      id: 101,
      name: "John Doe",
      email: "john.doe@example.com",
    },
    showActions: true,
  },
  {
    ID: 2,
    CreatedAt: "2024-03-18T01:00:00.000Z",
    UpdatedAt: "2024-03-18T01:00:00.000Z",
    DeletedAt: null,
    id: 2,
    total_price: 80.0,
    status: "pending",
    user_id: 102,
    booking_slot_id: 202,
    booking_slot: {
      ID: 202,
      CreatedAt: "2024-03-02T00:00:00.000Z",
      UpdatedAt: "2024-03-02T00:00:00.000Z",
      DeletedAt: null,
      id: 202,
      facility_id: 302,
      start_time: "2024-03-18T10:00:00.000Z",
      end_time: "2024-03-18T12:00:00.000Z",
      is_available: false,
      facility: {
        ID: 302,
        CreatedAt: "2023-12-05T00:00:00.000Z",
        UpdatedAt: "2024-02-10T00:00:00.000Z",
        DeletedAt: null,
        id: 302,
        name: "Executive Meeting Room",
        price: 80,
        capacity: 20,
        available: true,
      },
    },
    user: {
      ID: 102,
      CreatedAt: "2023-06-20T00:00:00.000Z",
      UpdatedAt: "2024-02-20T00:00:00.000Z",
      DeletedAt: null,
      id: 102,
      name: "Jane Smith",
      email: "jane.smith@example.com",
    },
    showActions: true,
  },
  {
    ID: 3,
    CreatedAt: "2024-03-20T02:00:00.000Z",
    UpdatedAt: "2024-03-20T02:00:00.000Z",
    DeletedAt: null,
    id: 3,
    total_price: 120.0,
    status: "pending",
    user_id: 103,
    booking_slot_id: 203,
    booking_slot: {
      ID: 203,
      CreatedAt: "2024-03-03T00:00:00.000Z",
      UpdatedAt: "2024-03-03T00:00:00.000Z",
      DeletedAt: null,
      id: 203,
      facility_id: 303,
      start_time: "2024-03-20T13:00:00.000Z",
      end_time: "2024-03-20T17:00:00.000Z",
      is_available: false,
      facility: {
        ID: 303,
        CreatedAt: "2023-11-10T00:00:00.000Z",
        UpdatedAt: "2024-01-15T00:00:00.000Z",
        DeletedAt: null,
        id: 303,
        name: "Training Room Alpha",
        price: 120,
        capacity: 40,
        available: true,
      },
    },
    user: {
      ID: 103,
      CreatedAt: "2021-09-01T00:00:00.000Z",
      UpdatedAt: "2024-02-01T00:00:00.000Z",
      DeletedAt: null,
      id: 103,
      name: "Michael Lee",
      email: "michael.lee@example.com",
    },
    showActions: true,
  },
];

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  const handleApprove = (id: number) => {
    alert(`Approving booking ${id}`);
  };

  const handleReject = (id: number) => {
    alert(`Rejecting booking ${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isAdmin={true} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your bookings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <div className="rounded-lg border border-border bg-card">
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between">
                  <h3>All Booking Requests</h3>
                </div>
              </div>
              <div className="p-6 pt-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {RECENT_BOOKINGS.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    {...booking}
                    showActions={true}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
