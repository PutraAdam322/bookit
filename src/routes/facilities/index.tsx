import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import Header from '@/components/Header';
import VenueCard from '@/components/VenueCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getAccessToken } from '@/auth';

const facilitiesQuery = queryOptions({
  queryKey: ['facilities'],
  queryFn: async () => {
    const res = await fetch('http://localhost:8080/api/v1/facilities', {
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


const userQuery = () => queryOptions({
  queryKey: ['user'],
  queryFn: async () => {
    const token = getAccessToken()
    const res = await fetch(`http://localhost:8080/api/v1/users`, {
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

export const Route = createFileRoute('/facilities/')({
  loader: ({ context }) => {
    return context.queryClient.ensureQueryData(facilitiesQuery)
  },
  component: RouteComponent,
})

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(300);
  const [selectedCapacity, setSelectedCapacity] = useState('all');
  const { data } = useSuspenseQuery(facilitiesQuery)

  const user = useSuspenseQuery(userQuery())

  return (
    <div className="min-h-screen bg-background">
      <Header isAdmin = {user.data.isAdmin} />
      
      <div className="container mx-auto px-8 py-8">
        <div className="mb-8">
          <h1 className="mb-2">Browse Venues</h1>
          <p className="text-muted-foreground">
            Find the perfect space for your event
          </p>
        </div>

        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="capacity">Capacity</option>
          </select>

          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mb-6 p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3>Filter Venues</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="p-1 hover:bg-accent rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label>Max Price per Hour: ${maxPrice}</label>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label>Capacity</label>
                <select 
                  value={selectedCapacity}
                  onChange={(e) => setSelectedCapacity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">Any Capacity</option>
                  <option value="small">Up to 20</option>
                  <option value="medium">20-50</option>
                  <option value="large">50-100</option>
                  <option value="xlarge">100+</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {data.length} venues
        </div>

        {/* Venue Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((d: any) => (
            <VenueCard key={d.id} {...d} />
          ))}
        </div>
      </div>
    </div>
  );
}
