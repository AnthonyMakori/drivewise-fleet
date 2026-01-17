import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone } from "lucide-react";
import api from "@/lib/api";
import { useState, useEffect } from "react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export const CustomersManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const bookings = await api.getBookings();
        // derive unique customers from bookings.user (backend returns user for admin)
        const map = new Map<string, Customer>();
        bookings.forEach((b: any) => {
          const u = b.raw.user || b.raw.user_id || b.raw.user;
          const userObj = b.raw.user || b.raw.user || b.raw.user;
          if (b.raw.user) {
            const uu = b.raw.user;
            if (!map.has(String(uu.id))) {
              map.set(String(uu.id), { id: String(uu.id), name: uu.name, email: uu.email, phone: uu.phone || "" });
            }
          }
        });
        setCustomers(Array.from(map.values()));
      } catch (e) {
        setCustomers([]);
      }
    };
    load();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {customers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No customers found</p>
          ) : (
            customers.map((customer) => (
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
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
