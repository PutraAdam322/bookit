import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query';
import { Building2 } from 'lucide-react';
import { loginApi } from '@/api/client';
import { queryClient } from '@/queryClient';
import { setAccessToken } from '@/utils/utils';


export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginApi(email, password),
    onSuccess: (data) => {
      if (data?.data) {
        setAccessToken(data.data, true)
      }
      try { queryClient.invalidateQueries() } catch {}
      navigate({ to: '/' })
    },
  })
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const email = String(fd.get('email') ?? '')
    const password = String(fd.get('password') ?? '')
    mutation.mutate({ email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md rounded-lg border border-border bg-card">
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h2 className="mb-2">Welcome Back</h2>
          <p className="text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>
        
        <div className="p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block">Email</label>
              <input
                id="email"
                type="email"
                name='email'
                placeholder="you@example.com"
                required
                className="w-full px-3 py-2 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-gray-400"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password">Password</label>
                <i className="text-sm text-primary hover:underline">
                  Forgot password?
                </i>
              </div>
              <input
                id="password"
                type="password"
                name='password'
                placeholder="••••••••"
                required
                className="w-full px-3 py-2 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-gray-400"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              disabled={mutation.isPending}
            >
            {mutation.isPending ? 'Signing in…' : 'Sign in'}
            </button>
            {mutation.isError && <div className="text-red-600 mt-2">{(mutation.error as any)?.message}</div>}
            
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <i className="text-primary hover:underline">
                Sign up
              </i>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
}
