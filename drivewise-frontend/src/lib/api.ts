import api from "./axios";

function normalizeCar(c: any) {
  return {
    id: String(c.id),
    name: c.name,
    brand: c.brand,
    model: c.model,
    year: c.year,
    seats: c.seats,
    transmission: (c.gear_type || c.gearType || "").toString().replace(/^(.)/, s => s.toUpperCase()),
    fuelType: (c.fuel_type || c.fuelType || "").toString().replace(/^(.)/, s => s.toUpperCase()),
    dailyRate: c.daily_price ?? c.dailyRate ?? 0,
    status: c.active ? "available" : "unavailable",
    images: c.images || [],
    description: c.description || "",
    raw: c,
  };
}

function normalizeBooking(b: any) {
  return {
    id: String(b.id),
    carId: b.car_id ?? b.car?.id ?? (b.car?.id && String(b.car.id)),
    customerId: b.user_id ?? b.customerId ?? b.user?.id,
    startDate: b.start_date ?? b.startDate,
    endDate: b.end_date ?? b.endDate,
    totalCost: b.total_price ?? b.totalCost ?? 0,
    status: b.status,
    createdAt: b.created_at ?? b.createdAt,
    car: b.car ? normalizeCar(b.car) : undefined,
    raw: b,
  };
}

export async function getCars(params: Record<string, any> = {}) {
  const res = await api.get("/cars", { params });
  const data = res.data?.data || res.data || [];
  return data.map(normalizeCar);
}

export async function getCar(id: string) {
  const res = await api.get(`/cars/${id}`);
  return normalizeCar(res.data);
}

export async function checkAvailability(carId: string, start_date: string, end_date: string) {
  const res = await api.get(`/cars/${carId}/availability`, { params: { start_date, end_date } });
  return res.data?.available === true;
}

export async function getBookings() {
  const res = await api.get(`/bookings`);
  const data = res.data?.data || res.data || [];
  return data.map(normalizeBooking);
}

export async function createBooking(payload: { car_id: string; start_date: string; end_date: string; notes?: string; }) {
  const res = await api.post(`/bookings`, payload);
  return normalizeBooking(res.data);
}

export async function cancelBooking(bookingId: string) {
  const res = await api.post(`/bookings/${bookingId}/cancel`);
  return normalizeBooking(res.data);
}

export async function updateBookingStatus(bookingId: string, status: string) {
  const res = await api.patch(`/bookings/${bookingId}/status`, { status });
  return normalizeBooking(res.data);
}

export async function getMe() {
  const res = await api.get(`/me`);
  return res.data;
}

export async function createCar(payload: any) {
  const res = await api.post(`/cars`, payload);
  return normalizeCar(res.data);
}

export async function updateCar(carId: string, payload: any) {
  const res = await api.patch(`/cars/${carId}`, payload);
  return normalizeCar(res.data);
}

export async function deleteCar(carId: string) {
  const res = await api.delete(`/cars/${carId}`);
  return res.data;
}

export default {
  getCars,
  getCar,
  getBookings,
  createBooking,
  checkAvailability,
  getMe,
  createCar,
  updateCar,
  deleteCar
};
