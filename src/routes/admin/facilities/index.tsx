import { createFileRoute } from '@tanstack/react-router'
import { Building2 } from 'lucide-react';
import Header from '@/components/Header';

export const Route = createFileRoute('/admin/facilities/')({
  component: RouteComponent,
})

function RouteComponent() {
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
                      </div>
                      <div className="p-6 pt-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        
                      </div>
                    </div>
                  </div>
                </div>
      </div>
    </div>
  );
}
