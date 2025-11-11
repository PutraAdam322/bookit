import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { getAccessToken } from '@/utils/utils';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import { useAuth } from '@/auth/AuthProvider';
import UnauthorizedHandling from '@/components/UnauthorizedHandling';

const url = import.meta.env.VITE_API_URL

export const Route = createFileRoute('/admin/facilities/create/')({
  component: RouteComponent,
  errorComponent: ({}) => (
    <UnauthorizedHandling />
  ),
})

function RouteComponent() {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated)
  if(!isAuthenticated) throw new Error()


  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    price: '',
    available: true,
  });

  const mutation = useMutation({
    mutationFn: async (payload: { name: string; price: number; capacity: number; available: boolean }) => {
      const res = await fetch(`${url}/api/v1/facilities/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAccessToken(),
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      try {
        const json = JSON.parse(text);
        if (!res.ok) {
          throw new Error(json?.message ?? `HTTP ${res.status}`);
        }
        return json;
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : String(err));
      }
    },
    onSuccess: () => {
      alert('Create facility successful!');
    },
    onError: (err: any) => {
      console.error('Create facility failed:', err);
      alert('Create facility failed: ' + (err?.message ?? String(err)));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      price: formData.price === '' ? 0 : parseFloat(formData.price),
      capacity: formData.capacity === '' ? 0 : parseInt(formData.capacity, 10),
      available: !!formData.available,
    };

    if (!payload.name || payload.price <= 0 || payload.capacity <= 0) {
      alert('Please enter valid name, price and capacity.');
      return;
    }

    try {
      await mutation.mutateAsync(payload);
      navigate({ to: '/admin/facilities' });
    } catch (err) {
    }
  };


  return (
    <div className="min-h-screen bg-background">
      {<Header isAdmin={true} />}
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <i className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </i>

        <div className="mb-8">
          <h1 className="mb-2">Add New Venue</h1>
          <p className="text-muted-foreground">
            Fill in the details to add a new venue to the system
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name">Facility Name *</label>
                <input
                  id="name"
                  placeholder="e.g., Grand Conference Hall"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="capacity">Capacity (people) *</label>
                  <input
                    id="capacity"
                    type="number"
                    placeholder="e.g., 50"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="price">Price per Hour ($) *</label>
                  <input
                    id="price"
                    type="number"
                    placeholder="e.g., 100"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-end">
            <i>
              <button type="button" className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
                Cancel
              </button>
            </i>
            <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
              Add Venue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
