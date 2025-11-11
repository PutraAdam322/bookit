import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Search } from 'lucide-react';
import Header from '@/components/Header'

export const Route = createFileRoute("/")({
  component: App,
})

function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header isAdmin={false}/>
      
      <section className="bg-linear-to-b from-gray-50 to-gray-200 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-4">
              Book Your Perfect Venue
            </h1>
            <p className="text-muted-foreground mb-8">
              Discover and reserve the ideal space for your meetings, events, and gatherings.
              Browse our curated selection of premium venues.
            </p>
            
            <div className="flex gap-2 max-w-xl mx-auto mb-8">
              <input
                type="text"
                placeholder="Search venues..."
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>
            
            <div className="flex gap-4 justify-center">
              <i>
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity" onClick={() => navigate({to: '/facilities'})}>
                  Browse All Venues
                </button>
              </i>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4">Ready to Book Your Venue?</h2>
          <p className="mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Join hundreds of satisfied customers who trust VenueBook for their event space needs.
            Sign up today and get access to exclusive venues.
          </p>
          <i>
            <button className="px-6 py-3 bg-white text-primary rounded-lg hover:opacity-90 transition-opacity">
              Create Free Account
            </button>
          </i>
        </div>
      </section>
    </div>
  )
}
