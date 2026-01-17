import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import type { Booking } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Check, X, Car as CarIcon, RotateCcw } from "lucide-react";

export const BookingsManagement = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const remote = await api.getBookings();
        setBookings(remote);
      } catch (e) {
        setBookings([]);
      }
    };
    load();
  }, []);

  const updateBooking = async (id: string, status: Booking["status"]) => {
    try {
      const res = await api.updateBookingStatus(id, status);
      const updated = bookings.map(b => b.id === id ? { ...b, status: res.status } : b);
      setBookings(updated);
      toast({ title: `Booking ${status}` });
    } catch (e) {
      toast({ variant: "destructive", title: "Update failed", description: "Could not update booking status" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-warning text-warning-foreground";
      case "approved": return "bg-success text-success-foreground";
      case "out": return "bg-primary text-primary-foreground";
      case "returned": return "bg-muted text-muted-foreground";
      case "declined": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No bookings yet</p>
          ) : (
            bookings.map((booking) => {
              const car = (booking as any).car;
              const customer = (booking as any).raw?.user;
              if (!car || !customer) return null;

              return (
                <div key={booking.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-4">
                      <img src={car.images[0]} alt={car.name} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <h3 className="font-semibold">{car.name}</h3>
                        <p className="text-sm text-muted-foreground">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Start:</span>{" "}
                      <span className="font-medium">
                        {format(new Date(booking.startDate || booking.start_date), "MMM dd, yyyy")}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">End:</span>{" "}
                      <span className="font-medium">
                        {format(new Date(booking.endDate || booking.end_date), "MMM dd, yyyy")}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total:</span>{" "}
                      <span className="font-medium text-primary">${booking.totalCost || booking.total_price}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {booking.status === "pending" && (
                      <>
                        <Button size="sm" onClick={() => updateBooking(booking.id, "approved")}>
                          <Check className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => updateBooking(booking.id, "declined")}>
                          <X className="mr-2 h-4 w-4" />
                          Decline
                        </Button>
                      </>
                    )}
                    {booking.status === "approved" && (
                      <Button size="sm" onClick={() => updateBooking(booking.id, "out")}>
                        <CarIcon className="mr-2 h-4 w-4" />
                        Mark as Out
                      </Button>
                    )}
                    {booking.status === "out" && (
                      <Button size="sm" onClick={() => updateBooking(booking.id, "returned")}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Mark as Returned
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
