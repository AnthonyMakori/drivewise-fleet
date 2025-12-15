import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 py-20 text-center animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Your Journey Starts Here
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover the perfect car for your next adventure. Premium vehicles, competitive prices, and seamless booking.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="text-lg">
            <Link to="/cars">
              Browse Cars
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-lg">
            <Link to="#search">Search Now</Link>
          </Button>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="text-4xl font-bold text-primary mb-2">100+</div>
            <div className="text-muted-foreground">Premium Cars</div>
          </div>
          <div className="text-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="text-4xl font-bold text-primary mb-2">5000+</div>
            <div className="text-muted-foreground">Happy Customers</div>
          </div>
          <div className="text-center animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
            <div className="text-muted-foreground">Customer Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};
