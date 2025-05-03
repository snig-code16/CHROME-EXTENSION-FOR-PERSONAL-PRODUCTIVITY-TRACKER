import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { ThemeProvider } from "@/context/ThemeContext";

const NotFound = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <div className="space-y-6 max-w-md">
          <AlertCircle className="h-16 w-16 mx-auto text-neutral" />
          <h1 className="text-4xl font-bold tracking-tight">Page Not Found</h1>
          <p className="text-muted-foreground text-lg">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button asChild>
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default NotFound;
