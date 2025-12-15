import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Economy",
    price: "$50-80",
    features: [
      "Compact & fuel-efficient cars",
      "Basic insurance included",
      "24/7 roadside assistance",
      "Unlimited mileage",
    ],
  },
  {
    name: "Standard",
    price: "$80-120",
    features: [
      "Mid-size comfortable cars",
      "Comprehensive insurance",
      "24/7 premium support",
      "Unlimited mileage",
      "Free GPS navigation",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "$120+",
    features: [
      "Luxury & sports cars",
      "Full coverage insurance",
      "Dedicated concierge",
      "Unlimited mileage",
      "Free GPS & WiFi",
      "Priority booking",
    ],
  },
];

export const PricingSection = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Pricing Plans</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.popular ? "border-primary shadow-lg" : ""}>
              <CardHeader>
                {plan.popular && (
                  <div className="text-center mb-2">
                    <span className="bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardTitle className="text-2xl text-center">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-center text-primary mt-4">
                  {plan.price}
                  <span className="text-sm text-muted-foreground font-normal">/day</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
                  <Link to="/cars">View Cars</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
