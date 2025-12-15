export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  seats: number;
  transmission: "Automatic" | "Manual";
  fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  dailyRate: number;
  status: "available" | "unavailable" | "out";
  images: string[];
  description: string;
}

export interface Booking {
  id: string;
  carId: string;
  customerId: string;
  startDate: string;
  endDate: string;
  totalCost: number;
  status: "pending" | "approved" | "declined" | "out" | "returned";
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
}

export const mockCars: Car[] = [
  {
    id: "1",
    name: "Tesla Model 3",
    brand: "Tesla",
    model: "Model 3",
    year: 2024,
    seats: 5,
    transmission: "Automatic",
    fuelType: "Electric",
    dailyRate: 120,
    status: "available",
    images: ["https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop"],
    description: "Premium electric sedan with autopilot features and exceptional range."
  },
  {
    id: "2",
    name: "BMW X5",
    brand: "BMW",
    model: "X5",
    year: 2023,
    seats: 7,
    transmission: "Automatic",
    fuelType: "Petrol",
    dailyRate: 150,
    status: "available",
    images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop"],
    description: "Luxury SUV with spacious interior and advanced safety features."
  },
  {
    id: "3",
    name: "Mercedes C-Class",
    brand: "Mercedes-Benz",
    model: "C-Class",
    year: 2024,
    seats: 5,
    transmission: "Automatic",
    fuelType: "Diesel",
    dailyRate: 110,
    status: "available",
    images: ["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop"],
    description: "Elegant sedan combining performance with luxury and comfort."
  },
  {
    id: "4",
    name: "Toyota Camry",
    brand: "Toyota",
    model: "Camry",
    year: 2023,
    seats: 5,
    transmission: "Automatic",
    fuelType: "Hybrid",
    dailyRate: 80,
    status: "available",
    images: ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop"],
    description: "Reliable hybrid sedan with excellent fuel economy."
  },
  {
    id: "5",
    name: "Audi Q7",
    brand: "Audi",
    model: "Q7",
    year: 2024,
    seats: 7,
    transmission: "Automatic",
    fuelType: "Petrol",
    dailyRate: 140,
    status: "available",
    images: ["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop"],
    description: "Premium SUV with cutting-edge technology and spacious design."
  },
  {
    id: "6",
    name: "Honda Accord",
    brand: "Honda",
    model: "Accord",
    year: 2023,
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    dailyRate: 75,
    status: "available",
    images: ["https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&auto=format&fit=crop"],
    description: "Comfortable and efficient sedan perfect for long drives."
  },
];

export const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    role: "customer",
  },
  {
    id: "admin",
    name: "Admin User",
    email: "admin@carhire.com",
    phone: "+1234567899",
    role: "admin",
  },
];

export const mockBookings: Booking[] = [];

export const testimonials = [
  {
    id: "1",
    name: "Sarah Johnson",
    rating: 5,
    comment: "Excellent service! The car was in perfect condition and the booking process was seamless.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop"
  },
  {
    id: "2",
    name: "Michael Chen",
    rating: 5,
    comment: "Great selection of cars and very competitive prices. Will definitely use again!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop"
  },
  {
    id: "3",
    name: "Emma Williams",
    rating: 5,
    comment: "Professional service and well-maintained vehicles. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop"
  },
];

export const faqs = [
  {
    question: "What documents do I need to rent a car?",
    answer: "You'll need a valid driver's license, a credit card in your name, and a form of identification (passport or national ID)."
  },
  {
    question: "What is the minimum age to rent a car?",
    answer: "The minimum age is 21 years old. Drivers under 25 may be subject to a young driver surcharge."
  },
  {
    question: "Can I cancel or modify my booking?",
    answer: "Yes, you can cancel or modify your booking up to 24 hours before the pickup time for a full refund."
  },
  {
    question: "Is insurance included in the rental price?",
    answer: "Basic insurance is included. Additional coverage options are available at checkout."
  },
  {
    question: "Can I rent a car for someone else?",
    answer: "The primary driver must be present with their documents. Additional drivers can be added for a small fee."
  },
];
