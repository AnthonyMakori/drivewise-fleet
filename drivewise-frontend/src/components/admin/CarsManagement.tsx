import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import type { Car } from "@/lib/mockData";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Power, PowerOff } from "lucide-react";

export const CarsManagement = () => {
  const { toast } = useToast();
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const remote = await api.getCars();
        setCars(remote);
      } catch (e) {
        setCars([]);
      }
    };
    load();
  }, []);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  // store file objects separately for detection
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setFormData(car);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this car? This action cannot be undone.")) return;
    try {
      setDeletingId(id);
      await api.deleteCar(id);
      setCars(prev => prev.filter(c => c.id !== id));
      toast({ title: "Car deleted" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Delete failed", description: e?.response?.data?.message || "Could not delete car" });
    } finally {
      setDeletingId(null);
    }
  };

  const toggleStatus = async (id: string) => {
    const car = cars.find(c => c.id === id);
    if (!car) return;
    const newActive = car.status !== "available";
    try {
      const updated = await api.updateCar(id, { active: newActive });
      setCars(prev => prev.map(c => c.id === id ? updated : c));
      toast({ title: "Car status updated" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Update failed", description: e?.response?.data?.message || "Could not update car" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // If image files selected, send multipart/form-data
      const hasFiles = imageFiles && imageFiles.length > 0;

      if (hasFiles) {
        const fd = new FormData();
        fd.append('name', String(formData.name || ''));
        fd.append('brand', String(formData.brand || ''));
        fd.append('model', String(formData.model || ''));
        fd.append('year', String(formData.year || ''));
        fd.append('seats', String(formData.seats || ''));
        fd.append('gear_type', String((formData.transmission || '').toString().toLowerCase()));
        fd.append('fuel_type', String(formData.fuelType || ''));
        fd.append('daily_price', String(formData.dailyRate || 0));
        fd.append('description', String(formData.description || ''));
        fd.append('active', formData.status === 'available' ? '1' : '0');
        imageFiles.forEach((f) => fd.append('images_files[]', f));

        if (editingCar) {
          const updated = await api.updateCar(editingCar.id, fd);
          setCars(prev => prev.map(c => c.id === editingCar.id ? updated : c));
          toast({ title: 'Car updated' });
        } else {
          const created = await api.createCar(fd);
          setCars(prev => [created, ...prev]);
          toast({ title: 'Car created' });
        }
      } else {
        const payload: any = {
          name: formData.name,
          brand: formData.brand,
          model: formData.model,
          year: formData.year,
          seats: formData.seats,
          gear_type: (formData.transmission || "").toString().toLowerCase(),
          fuel_type: formData.fuelType,
          daily_price: formData.dailyRate,
          description: formData.description,
          images: formData.images && formData.images.length ? formData.images : [],
          active: formData.status === "available",
        };

        if (editingCar) {
          const updated = await api.updateCar(editingCar.id, payload);
          setCars(prev => prev.map(c => c.id === editingCar.id ? updated : c));
          toast({ title: "Car updated" });
        } else {
          const created = await api.createCar(payload);
          setCars(prev => [created, ...prev]);
          toast({ title: "Car created" });
        }
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
    } catch (e: any) {
      toast({ variant: "destructive", title: "Save failed", description: e?.response?.data?.message || "Could not save car" });
    } finally {
      setSubmitting(false);
    }
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
                  <div className="mt-2">
                    <Label>Or upload images</Label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files ? Array.from(e.target.files) : [];
                        setImageFiles(files);
                        // clear any manual URL when uploading
                        if (files.length) setFormData({ ...formData, images: [] });
                      }}
                    />
                  </div>
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
