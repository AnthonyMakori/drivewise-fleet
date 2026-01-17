import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAuthState } from "@/lib/auth";
import api from "@/lib/api";
import type { Booking as Booking } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar, DollarSign, Car } from "lucide-react";

const Bookings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const authState = getAuthState();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate("/login");
      return;
    }
    const load = async () => {
      try {
        const remote = await api.getBookings();
        setBookings(remote);
      } catch (e) {
        setBookings([]);
      }
    };
    load();
  }, [authState, navigate]);

  const handleCancel = (bookingId: string) => {
    (async () => {
      try {
        const res = await api.cancelBooking(bookingId);
        const updated = bookings.map(b => b.id === bookingId ? { ...b, status: res.status } : b);
        setBookings(updated);
        toast({ title: "Booking cancelled", description: "Your booking has been cancelled successfully." });
      } catch (e) {
        toast({ variant: "destructive", title: "Cancel failed", description: "Could not cancel booking" });
      }
    })();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-warning text-warning-foreground";
      case "approved": return "bg-success text-success-foreground";
      case "out": return "bg-primary text-primary-foreground";
      case "returned": return "bg-muted text-muted-foreground";
      case "declined": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">My Bookings</h1>
        
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">You don't have any bookings yet.</p>
              <Button onClick={() => navigate("/cars")}>Browse Cars</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => {
              const car = booking.car;
              if (!car) return null;
              
              return (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <img 
                          src={car.images[0]} 
                          alt={car.name}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <div>
                          <CardTitle className="text-xl mb-2">{car.name}</CardTitle>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm text-muted-foreground">Start Date</div>
                          <div className="font-medium">
                            {format(new Date(booking.startDate), "MMM dd, yyyy")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm text-muted-foreground">End Date</div>
                          <div className="font-medium">
                            {format(new Date(booking.endDate), "MMM dd, yyyy")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm text-muted-foreground">Total Cost</div>
                          <div className="font-medium text-primary">${booking.totalCost}</div>
                        </div>
                      </div>
                    </div>
                    
                    {booking.status === "pending" && (
                      <div className="mt-4">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleCancel(booking.id)}
                        >
                          Cancel Booking
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Bookings;
