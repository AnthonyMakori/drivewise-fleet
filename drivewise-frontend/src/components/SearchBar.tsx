import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SearchBar = () => {
  const navigate = useNavigate();
  const [carType, setCarType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (carType) params.set("type", carType);
    if (priceRange) params.set("price", priceRange);
    navigate(`/cars?${params.toString()}`);
  };

  return (
    <section id="search" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Find Your Perfect Car</h2>
          
          <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={carType} onValueChange={setCarType}>
                <SelectTrigger>
                  <SelectValue placeholder="Car Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-80">$0 - $80</SelectItem>
                  <SelectItem value="81-120">$81 - $120</SelectItem>
                  <SelectItem value="121-200">$121 - $200</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleSearch} className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Search Cars
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
