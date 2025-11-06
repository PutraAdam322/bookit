import { getAccessToken } from '@/auth';
import { logoutLocal } from '@/api/client';
import { useNavigate } from '@tanstack/react-router';
import { User, LogOut, Building2 } from 'lucide-react';

interface HeaderProps {
  isAdmin: boolean
}




const isToken  = (token:string) => {return (token != "null")}

export default function Header({ isAdmin }: HeaderProps) {
  const locationPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const navigate = useNavigate();
  const token:boolean = isToken(getAccessToken())
  //console.log(token)

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Building2 className="h-6 w-6" />
            <span className="font-medium">Bookit</span>
          </a>

          <nav className="hidden md:flex items-center gap-6">
            {!isAdmin && (
              <>
                <a
                  href=""
                  className={`hover:text-primary transition-colors ${
                    locationPath === '/facilities' ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  onClick={() => navigate({to: '/facilities'}) }
                >
                  Browse Venues
                </a>
                {!isAdmin && token && (
                  <a
                    href="/my-bookings"
                    className={`hover:text-primary transition-colors ${
                      locationPath === '/my-bookings' ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    My Bookings
                  </a>
                )}
              </>
            )}

            {isAdmin && (
              <>
                <a
                  href="/admin"
                  className={`hover:text-primary transition-colors ${
                    locationPath === '/admin' ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  Dashboard
                </a>
                <a
                  href="/admin/facilities"
                  className={`hover:text-primary transition-colors ${
                    locationPath === '/admin/facilities' ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  Facilities
                </a>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {!token ? (
              <>
                <a href="/login">
                  <button className="px-4 py-2 hover:bg-accent rounded-lg transition-colors">
                    Login
                  </button>
                </a>
                <a href="/signup">
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                    Sign Up
                  </button>
                </a>
              </>
            ) : (
              <>
                <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                  <User className="h-5 w-5" />
                </button>
                <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                  <LogOut className="h-5 w-5" onClick={() => logoutLocal()} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
