export interface User {
    id: string;
    name: string;
    email: string;
    rating: number;
}

export interface Vehicle {
    id: string;
    ownerId: string;
    brand: string;
    model: string;
    year: number;
    licencePlate: string;
    availableSeats: number;
}

export interface TripSegment {
    mode: "bus" | "scooter" | "carpool" | "walk";
    from: string;
    to: string;
    departure: string;
    arrival: string;
    price: number;
    driver?: string;
    vehicle: Vehicle;
}

export interface Trip {
    id: string;
    segments: TripSegment[];
    totalPrice: number;
    totalDuration: string;
}

export interface Booking {
    id: string;
    trip: Trip;
    status: "confirmed" | "pending" | "cancelled";
    bookedAt: string;
}

