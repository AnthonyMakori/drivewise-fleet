import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { mockCars, type Car } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Power, PowerOff } from "lucide-react";

export const CarsManagement = () => {
  const { toast } = useToast();
  const [cars, setCars] = useState(mockCars);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<Car>>({
    name: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    dailyRate: 0,
    status: "available",
    images: [],
    description: "",
  });

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setFormData(car);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setCars(cars.filter(c => c.id !== id));
    toast({ title: "Car deleted successfully" });
  };

  const toggleStatus = (id: string) => {
    setCars(cars.map(c => 
      c.id === id 
        ? { ...c, status: c.status === "available" ? "unavailable" : "available" as const }
        : c
    ));
    toast({ title: "Car status updated" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCar) {
      setCars(cars.map(c => c.id === editingCar.id ? { ...formData as Car, id: editingCar.id } : c));
      toast({ title: "Car updated successfully" });
    } else {
      const newCar: Car = {
        ...formData as Car,
        id: Date.now().toString(),
        images: formData.images?.length ? formData.images : ["https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop"],
      };
      setCars([...cars, newCar]);
      toast({ title: "Car added successfully" });
    }
    
    setIsDialogOpen(false);
    setEditingCar(null);
    setFormData({
      name: "",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      seats: 5,
      transmission: "Automatic",
      fuelType: "Petrol",
      dailyRate: 0,
      status: "available",
      images: [],
      description: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Cars Management</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingCar(null); }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Car
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCar ? "Edit Car" : "Add New Car"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Car Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Brand</Label>
                    <Input
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Input
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Seats</Label>
                    <Input
                      type="number"
                      value={formData.seats}
                      onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Daily Rate ($)</Label>
                    <Input
                      type="number"
                      value={formData.dailyRate}
                      onChange={(e) => setFormData({ ...formData, dailyRate: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Transmission</Label>
                    <Select
                      value={formData.transmission}
                      onValueChange={(value) => setFormData({ ...formData, transmission: value as "Automatic" | "Manual" })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                        <SelectItem value="Manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Fuel Type</Label>
                    <Select
                      value={formData.fuelType}
                      onValueChange={(value) => setFormData({ ...formData, fuelType: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Petrol">Petrol</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input
                    value={formData.images?.[0] || ""}
                    onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                    placeholder="https://..."
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingCar ? "Update Car" : "Add Car"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cars.map((car) => (
            <div key={car.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
              <img src={car.images[0]} alt={car.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-semibold">{car.name}</h3>
                <p className="text-sm text-muted-foreground">{car.brand} • ${car.dailyRate}/day</p>
              </div>
              <Badge className={car.status === "available" ? "bg-success" : "bg-muted"}>
                {car.status}
              </Badge>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => toggleStatus(car.id)}>
                  {car.status === "available" ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleEdit(car)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(car.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
