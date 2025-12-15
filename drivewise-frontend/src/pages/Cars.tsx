import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CarCard } from "@/components/CarCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { mockCars } from "@/lib/mockData";

const Cars = () => {
  const [searchParams] = useSearchParams();
  const [filteredCars, setFilteredCars] = useState(mockCars);
  const [brand, setBrand] = useState("");
  const [transmission, setTransmission] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [priceRange, setPriceRange] = useState([0, 200]);

  const brands = Array.from(new Set(mockCars.map(car => car.brand)));

  useEffect(() => {
    let filtered = [...mockCars];

    // Apply filters
    if (brand) {
      filtered = filtered.filter(car => car.brand === brand);
    }
    if (transmission) {
      filtered = filtered.filter(car => car.transmission === transmission);
    }
    if (fuelType) {
      filtered = filtered.filter(car => car.fuelType === fuelType);
    }
    filtered = filtered.filter(
      car => car.dailyRate >= priceRange[0] && car.dailyRate <= priceRange[1]
    );

    // Apply URL params
    const typeParam = searchParams.get("type");
    const priceParam = searchParams.get("price");
    
    if (typeParam) {
      filtered = filtered.filter(car => 
        car.fuelType.toLowerCase().includes(typeParam.toLowerCase()) ||
        car.transmission.toLowerCase().includes(typeParam.toLowerCase())
      );
    }
    
    if (priceParam) {
      const [min, max] = priceParam.split("-").map(Number);
      filtered = filtered.filter(car => car.dailyRate >= min && car.dailyRate <= max);
    }

    setFilteredCars(filtered);
  }, [brand, transmission, fuelType, priceRange, searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Browse Our Fleet</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-lg border border-border sticky top-24">
              <h2 className="text-xl font-bold mb-6">Filters</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Brand</Label>
                  <Select value={brand} onValueChange={setBrand}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brands</SelectItem>
                      {brands.map(b => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Transmission</Label>
                  <Select value={transmission} onValueChange={setTransmission}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Fuel Type</Label>
                  <Select value={fuelType} onValueChange={setFuelType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Fuels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Fuels</SelectItem>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Price Range: ${priceRange[0]} - ${priceRange[1]}/day</Label>
                  <Slider
                    min={0}
                    max={200}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cars Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 text-muted-foreground">
              Showing {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'}
            </div>
            
            {filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCars.map(car => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No cars found matching your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Cars;
