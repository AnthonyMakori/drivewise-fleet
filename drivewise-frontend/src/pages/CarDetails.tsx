import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import api from "@/lib/api";
import type { Booking as BookingType } from "@/lib/mockData";
import { getAuthState } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Car, Users, Gauge, Fuel, Calendar as CalendarIcon, DollarSign } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [car, setCar] = useState<any | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [totalCost, setTotalCost] = useState(0);
  const authState = getAuthState();

  useEffect(() => {
    if (startDate && endDate && car) {
      const days = differenceInDays(endDate, startDate) + 1;
      setTotalCost(days * car.dailyRate);
    } else {
      setTotalCost(0);
    }
  }, [startDate, endDate, car]);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const c = await api.getCar(id);
        setCar(c);
      } catch (e) {
        setCar(undefined);
      }
    };
    load();
  }, [id]);

  if (!car) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Car not found</h1>
          <Button onClick={() => navigate("/cars")}>Browse Cars</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleBooking = () => {
    if (!authState.isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Login required",
        description: "Please login to book a car.",
      });
      navigate("/login");
      return;
    }

    if (!startDate || !endDate) {
      toast({
        variant: "destructive",
        title: "Select dates",
        description: "Please select start and end dates for your booking.",
      });
      return;
    }

    (async () => {
      try {
        const payload = {
          car_id: car.id,
          start_date: startDate.toISOString().slice(0,10),
          end_date: endDate.toISOString().slice(0,10),
        };
        await api.createBooking(payload);
        toast({
          title: "Booking submitted!",
          description: "Your booking request has been sent to admin for approval.",
        });
        navigate("/bookings");
      } catch (e: any) {
        toast({ variant: "destructive", title: "Booking failed", description: e?.response?.data?.message || "Could not create booking" });
      }
    })();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div className="rounded-lg overflow-hidden mb-4">
              <img 
                src={car.images[0]} 
                alt={car.name}
                className="w-full h-96 object-cover"
              />
            </div>
          </div>

          {/* Car Details */}
          <div>
            <h1 className="text-4xl font-bold mb-2">{car.name}</h1>
            <p className="text-xl text-muted-foreground mb-6">{car.year} • {car.brand}</p>
            
            <div className="mb-6">
              <div className="text-4xl font-bold text-primary mb-2">${car.dailyRate}</div>
              <div className="text-muted-foreground">per day</div>
            </div>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Seats</div>
                      <div className="font-medium">{car.seats}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Gauge className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Transmission</div>
                      <div className="font-medium">{car.transmission}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Fuel className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Fuel Type</div>
                      <div className="font-medium">{car.fuelType}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Model</div>
                      <div className="font-medium">{car.model}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Book This Car</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            disabled={(date) => !startDate || date < startDate}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {totalCost > 0 && (
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <span className="font-medium">Total Cost</span>
                      </div>
                      <span className="text-2xl font-bold text-primary">${totalCost}</span>
                    </div>
                  )}

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleBooking}
                    disabled={car.status !== "available"}
                  >
                    {car.status === "available" ? "Book Now" : "Unavailable"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{car.description}</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CarDetails;
