import type {Trip, Booking, User} from "../types";
import profilePic from "../assets/beard_bae.jpg"

// Fake logged-in user
export const currentUser: User = {
    id: "u1",
    name: "Severin",
    email: "severin@example.com",
    rating: 4.0,
    avatar: profilePic
};

// Fake trip results — what you'd get back from GET /api/trips
const mockTrips: Trip[] = [
    {
        id: "t1",
        totalPrice: 349,
        totalDuration: "6h 30m",
        segments: [
            {
                mode: "bus",
                from: "Bergen Busstasjon",
                to: "Voss",
                departure: "2026-03-25T08:00",
                arrival: "2026-03-25T09:30",
                provider: "Vy",
                price: 149,
                vehicle: undefined
            },
            {
                mode: "carpool",
                from: "Voss",
                to: "Oslo S",
                departure: "2026-03-25T10:00",
                arrival: "2026-03-25T14:30",
                provider: "TravelMix",
                price: 200,
                driver: { id: "u2", name: "Luka", email: "luka@example.com", rating: 3.0 },
                vehicle: {
                    id: "v1",
                    ownerId: "u2",
                    brand: "Volkswagen",
                    model: "ID.4",
                    licensePlate: "EV 12345",
                    availableSeats: 3,
                    year: 2025
                },
            },
        ],
    },
    {
        id: "t2",
        totalPrice: 199,
        totalDuration: "7h 45m",
        segments: [
            {
                mode: "bus",
                from: "Bergen Busstasjon",
                to: "Geilo",
                departure: "2026-03-25T09:00",
                arrival: "2026-03-25T11:45",
                provider: "Skyss",
                price: 119,
            },
            {
                mode: "walk",
                from: "Geilo stasjon",
                to: "Geilo sentrum",
                departure: "2026-03-25T11:45",
                arrival: "2026-03-25T12:00",
                provider: "walking",
                price: 0,
            },
            {
                mode: "scooter",
                from: "Geilo sentrum",
                to: "Geilo øst",
                departure: "2026-03-25T12:00",
                arrival: "2026-03-25T12:15",
                provider: "Tier",
                price: 30,
            },
            {
                mode: "bus",
                from: "Geilo øst",
                to: "Oslo S",
                departure: "2026-03-25T12:30",
                arrival: "2026-03-25T16:45",
                provider: "Vy",
                price: 50,
            },
        ],
    },
];

const mockBookings: Booking[] = [
    {
        id: "b1",
        trip: mockTrips[0],
        status: "confirmed",
        bookedAt: "2026-03-20T14:00",
    },
];

// These are the functions your pages will call.
// They return Promises because real API calls are async.
// When backend is ready, you replace the guts of these
// with actual fetch() calls — nothing else changes.

export async function searchTrips(from: string, to: string): Promise<Trip[]> {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 500));
    return mockTrips;
}

export async function getBookings(): Promise<Booking[]> {
    await new Promise((r) => setTimeout(r, 300));
    return mockBookings;
}

export async function bookTrip(tripId: string): Promise<Booking> {
    await new Promise((r) => setTimeout(r, 400));
    const trip = mockTrips.find((t) => t.id === tripId);
    if (!trip) throw new Error("Trip not found");
    return {
        id: "b" + Date.now(),
        trip,
        status: "pending",
        bookedAt: new Date().toISOString(),
    };
}