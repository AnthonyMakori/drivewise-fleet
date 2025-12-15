import { Link } from "react-router-dom";
import { Car, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <Car className="h-6 w-6 text-primary" />
              <span>CarHire Pro</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your trusted partner for premium car rentals. Experience quality, comfort, and convenience.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/cars" className="text-muted-foreground hover:text-primary">Browse Cars</Link></li>
              <li><Link to="#pricing" className="text-muted-foreground hover:text-primary">Pricing</Link></li>
              <li><Link to="#contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-primary">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="text-muted-foreground hover:text-primary">Help Center</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-primary">Cancellation Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CarHire Pro. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
