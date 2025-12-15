import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockCustomers } from "@/lib/mockData";
import { User, Mail, Phone } from "lucide-react";

export const CustomersManagement = () => {
  const customers = mockCustomers.filter(c => c.role === "customer");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {customers.map((customer) => (
            <div key={customer.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{customer.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Mail className="h-3 w-3" />
                      {customer.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Phone className="h-3 w-3" />
                      {customer.phone}
                    </div>
                  </div>
                </div>
                <Badge>Active</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
