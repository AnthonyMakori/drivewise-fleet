import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Car as CarType } from "@/lib/mockData";
import { Car, Users, Gauge, Fuel } from "lucide-react";
import { Link } from "react-router-dom";

interface CarCardProps {
  car: CarType;
}

export const CarCard = ({ car }: CarCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={car.images[0]} 
          alt={car.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-2 right-2 bg-background/90 text-foreground">
          {car.status === "available" ? "Available" : "Unavailable"}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-xl font-bold mb-2">{car.name}</h3>
        <p className="text-muted-foreground text-sm mb-4">{car.year} • {car.brand}</p>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{car.seats} Seats</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-muted-foreground" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-muted-foreground" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-muted-foreground" />
            <span>{car.model}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-primary">${car.dailyRate}</div>
          <div className="text-sm text-muted-foreground">per day</div>
        </div>
        <Button asChild disabled={car.status !== "available"}>
          <Link to={`/cars/${car.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
