import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAuthState, isAdmin } from "@/lib/auth";
import { mockCars, mockBookings, mockCustomers } from "@/lib/mockData";
import { Car, Users, DollarSign, Calendar, TrendingUp } from "lucide-react";
import { CarsManagement } from "@/components/admin/CarsManagement";
import { BookingsManagement } from "@/components/admin/BookingsManagement";
import { CustomersManagement } from "@/components/admin/CustomersManagement";
import { ReportsSection } from "@/components/admin/ReportsSection";

const Admin = () => {
  const navigate = useNavigate();
  const authState = getAuthState();
  const [bookings, setBookings] = useState(mockBookings);

  useEffect(() => {
    if (!authState.isAuthenticated || !isAdmin(authState.user)) {
      navigate("/");
    }

    // Load bookings from localStorage
    const stored = localStorage.getItem("car-hire-bookings");
    if (stored) {
      setBookings(JSON.parse(stored));
    }
  }, [authState, navigate]);

  const availableCars = mockCars.filter(c => c.status === "available").length;
  const carsOut = bookings.filter(b => b.status === "out").length;
  const totalRevenue = bookings
    .filter(b => b.status === "returned")
    .reduce((sum, b) => sum + b.totalCost, 0);
  const pendingBookings = bookings.filter(b => b.status === "pending").length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Cars
              </CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockCars.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {availableCars} available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cars Out
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{carsOut}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently rented
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Customers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockCustomers.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Registered users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {pendingBookings} pending bookings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="bookings" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="cars">Cars</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <BookingsManagement />
          </TabsContent>

          <TabsContent value="cars">
            <CarsManagement />
          </TabsContent>

          <TabsContent value="customers">
            <CustomersManagement />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsSection />
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default Admin;
