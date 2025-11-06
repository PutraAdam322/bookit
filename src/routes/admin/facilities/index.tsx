import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery, queryOptions } from '@tanstack/react-query';
import { Building2 } from 'lucide-react';
import Header from '@/components/Header';
import VenueCard from '@/components/VenueCard';

export const Route = createFileRoute('/admin/facilities/')({
  component: RouteComponent,
})

const facilitiesQuery = queryOptions({
  queryKey: ['facilities'],
  queryFn: async () => {
    const res = await fetch('https://bookit-backend-d4l7.onrender.com/api/v1/facilities', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) throw new Error('Failed to fetch facilities')
    const body = await res.json().catch(() => null)

    if (Array.isArray(body)) return body
    if (!body) return [] // no body

    return body.data ?? body.facilities ?? body.items ?? body.results ?? []
  },
})

function RouteComponent() {
  const { data } = useSuspenseQuery(facilitiesQuery)

  return(
    <div className="min-h-screen bg-background">
      <Header isAdmin = {true}/>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your facilities
            </p>
          </div>
          <i>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Add New Venue
            </button>
          </i>
        </div>
        <div className="grid grid-cols-1 gap-6">
                  <div>
                    <div className="rounded-lg border border-border bg-card">
                      <div className="p-6 pb-4">
                        <div className="flex items-center justify-between">
                          <h3>All Facilities</h3>
                        </div>
                        <div className="mb-4 text-sm text-muted-foreground">
                          Showing {data.length} venues
                        </div>
                        <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {data.map((d: any) => (
                            <VenueCard key={d.id} {...d} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
      </div>
    </div>
  );
}
