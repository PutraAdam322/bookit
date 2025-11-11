import { createFileRoute } from '@tanstack/react-router'
import Header from '@/components/Header';
import BookingCard from '@/components/BookingCard';
import type { Booking } from '@/interface/interface';
import { getAccessToken } from '@/utils/utils';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import UnauthorizedHandling from '@/components/UnauthorizedHandling';

const url = import.meta.env.VITE_API_URL

const bookingQuery = () => queryOptions({
  queryKey: ['bookings'],
  queryFn: async () => {
    const token = getAccessToken()
    const res = await fetch(`${url}/api/v1/bookings/admin/bookings`, 
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

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
  loader: ({context}) => {
    return context.queryClient.ensureQueryData(bookingQuery())
  },
  errorComponent: ({}) => (
    <UnauthorizedHandling />
  ),
})

function RouteComponent() {
  const { data } = useSuspenseQuery(bookingQuery())

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
                {data.data.map((b: Booking) => (
                  <BookingCard
                    key={b.id}
                    {...b}
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
