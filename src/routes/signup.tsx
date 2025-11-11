import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Building2 } from 'lucide-react';

const url = import.meta.env.VITE_API_URL

export const Route = createFileRoute('/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const mutation = useMutation({
    mutationFn: async (paylaod: { name: string; email: string; password: string }) =>{
          const res = await fetch(`${url}/api/v1/users/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(paylaod),
          })
          if (!res.ok) {
            const err = await res.json()
            throw new Error(err.message)
          }
          return res.json()
        },
    onSuccess: () => {
      navigate({ to: '/login' })
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    if (payload.password != formData.confirmPassword) throw new Error("Password doesn't match")
    try {
      await mutation.mutateAsync(payload);
      navigate({ to: '/admin/facilities' });
    } catch (err) {
    }
    navigate({to: '/'});
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md rounded-lg border border-border bg-card">
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h2 className="mb-2">Create Account</h2>
          <p className="text-muted-foreground">
            Sign up to start booking venues
          </p>
        </div>
        
        <div className="p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-gray-400"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-gray-400"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-gray-400"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-gray-400"
              />
            </div>
            
            
            <button 
              type="submit" 
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Create Account
            </button>
            
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <i onClick={() => navigate({to:"/login"})} className="text-primary hover:underline">
                Sign in
              </i>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
