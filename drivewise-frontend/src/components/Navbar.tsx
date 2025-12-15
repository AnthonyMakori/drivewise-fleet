import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Car, User, LogOut } from "lucide-react";
import { getAuthState, logout, isAdmin } from "@/lib/auth";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState(getAuthState());

  useEffect(() => {
    const checkAuth = () => setAuthState(getAuthState());
    window.addEventListener("storage", checkAuth);
    window.addEventListener("auth-change", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setAuthState({ user: null, isAuthenticated: false });
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Car className="h-6 w-6 text-primary" />
          <span className="text-foreground">CarHire Pro</span>
        </Link>

        <div className="flex items-center gap-4">
          {authState.isAuthenticated ? (
            <>
              {isAdmin(authState.user) ? (
                <Button variant="ghost" asChild>
                  <Link to="/admin">Admin Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/cars">Browse Cars</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/bookings">My Bookings</Link>
                  </Button>
                </>
              )}
              <Button variant="ghost" asChild>
                <Link to="/profile">
                  <User className="h-4 w-4 mr-2" />
                  {authState.user?.name}
                </Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
