import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockBookings } from "@/lib/mockData";
import { Download, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ReportsSection = () => {
  const { toast } = useToast();

  const totalBookings = mockBookings.length;
  const completedBookings = mockBookings.filter(b => b.status === "returned").length;
  const totalRevenue = mockBookings
    .filter(b => b.status === "returned")
    .reduce((sum, b) => sum + b.totalCost, 0);
  const avgBookingValue = completedBookings > 0 ? totalRevenue / completedBookings : 0;

  const handleExport = () => {
    toast({
      title: "Export started",
      description: "Your report will be downloaded shortly.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Booking Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgBookingValue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Revenue Overview</CardTitle>
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4" />
              <p>Revenue chart would be displayed here</p>
              <p className="text-sm mt-2">Connect to a backend to enable real-time charts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
