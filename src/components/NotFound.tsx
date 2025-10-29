import { ArrowLeft } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

export default function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-6">
            <h1 className="text-6xl font-bold mb-4 text-foreground">404</h1>
            <h2 className="text-2xl font-semibold mb-2 text-muted-foreground">
                Page Not Found
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
                The page you are looking for doesn’t exist or may have been moved.  
                Please check the URL or return to the homepage.
            </p>
            <button
                onClick={() => navigate({ to: '/' })}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
                <ArrowLeft className="h-4 w-4" />
                Go Back Home
            </button>
        </div>
    );
}