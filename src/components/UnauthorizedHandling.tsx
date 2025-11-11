import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

const UnauthorizedHandling = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-6">
            <h1 className="text-6xl font-bold mb-4 text-foreground">401</h1>
            <h2 className="text-2xl font-semibold mb-2 text-muted-foreground">
                Unauthorized Access
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
                The page cannot be accessed by unauthorized user. Please login first!
            </p>
            <button
                onClick={() => navigate({ to: '/login' })}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
                <ArrowLeft className="h-4 w-4" />
                Go Back Login
            </button>
        </div>
    )
}

export default UnauthorizedHandling