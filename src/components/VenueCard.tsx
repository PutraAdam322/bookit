import { Users } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import Placeholder from '@/visuals/placeholder.jpg'

interface VenueCardProps {
  id: string;
  name: string;
  capacity: number;
  price: number;
  available: boolean;
}

export default function VenueCard({
  id,
  name,
  capacity,
  price,
  available,
}: VenueCardProps) {
  const locationPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={Placeholder}
          alt={name}
          className="w-full h-full object-cover"
        />
        {!available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="px-3 py-1 rounded-md bg-destructive text-destructive-foreground text-sm">
              Unavailable
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="flex-1">{name}</h3>
        </div>
        
        <div className="space-y-2">  
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-sm">Up to {capacity} people</span>
          </div>
        </div>
        
        <div className="mt-4">
          <span className="text-muted-foreground">Starting from</span>
          <p className="mt-1">${price}/hour</p>
        </div>
      </div>
      
      <div className="p-4 pt-0">
        <i className="block w-full">
          <button 
            className={`${locationPath === '/admin/facilities' ? 'w-32' : 'w-full'} px-4 py-2 rounded-lg transition-opacity ${
              available 
                ? 'bg-primary text-primary-foreground hover:opacity-90' 
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
            disabled={!available}
            onClick={() => navigate({to: `/facilities/${id}`})}
          >
            {locationPath === '/admin/facilities' ? 'Edit' : (available ? 'View Details' : 'Unavailable')}
          </button>
        </i>
      </div>
    </div>
  );
}
