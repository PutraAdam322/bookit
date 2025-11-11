import { useNavigate } from "@tanstack/react-router";
import { User, LogOut, Building2 } from "lucide-react";
import { useAuth } from "@/auth/AuthProvider"; // adjust path to your provider

interface HeaderProps {
  isAdmin: boolean
}

export default function Header({isAdmin}:HeaderProps) {
  const locationPath = typeof window !== "undefined" ? window.location.pathname : "";
  const navigate = useNavigate();

  const { isAuthenticated, logout, user } = useAuth();

  const go = (to: string) => {
    navigate({ to });
  };

  const handleLogout = () => {
    logout()
    navigate({to: "/login"})
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => go("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            aria-label="Home"
          >
            <Building2 className="h-6 w-6" />
            <span className="font-medium">Bookit</span>
          </button>

          <nav className="hidden md:flex items-center gap-6">
            {!isAdmin && (
              <>
                <button
                  onClick={() => go("/facilities")}
                  className={`hover:text-primary transition-colors ${
                    locationPath === "/facilities" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Browse Venues
                </button>

                {isAuthenticated && !isAdmin && (
                  <button
                    onClick={() => go("/my-bookings")}
                    className={`hover:text-primary transition-colors ${
                      locationPath === "/my-bookings" ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    My Bookings
                  </button>
                )}
              </>
            )}

            {isAuthenticated && isAdmin && (
              <>
                <button
                  onClick={() => go("/admin")}
                  className={`hover:text-primary transition-colors ${
                    locationPath === "/admin" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => go("/admin/facilities")}
                  className={`hover:text-primary transition-colors ${
                    locationPath === "/admin/facilities" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Facilities
                </button>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => go("/login")}
                  className="px-4 py-2 hover:bg-accent rounded-lg transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => go("/signup")}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <button
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                  title={user?.data.name ?? "Profile"}
                >
                  <User className="h-5 w-5" />
                </button>

                <button
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                  onClick={() => handleLogout()}
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
