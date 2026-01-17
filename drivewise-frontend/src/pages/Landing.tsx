import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SearchBar } from "@/components/SearchBar";
import { CarCard } from "@/components/CarCard";
import { Testimonials } from "@/components/Testimonials";
import { ContactSection } from "@/components/ContactSection";
import { PricingSection } from "@/components/PricingSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import api from "@/lib/api";
import type { Car as CarType } from "@/lib/mockData";

const Landing = () => {
  const [featuredCars, setFeaturedCars] = useState<CarType[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const cars = await api.getCars();
        setFeaturedCars(cars.slice(0, 3));
      } catch (e) {
        setFeaturedCars([]);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <SearchBar />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Cars</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>
      
      <Testimonials />
      <PricingSection />
      <ContactSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Landing;
