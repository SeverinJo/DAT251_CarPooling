import { OpenAPI } from "./generated/core/OpenAPI";
import { TripControllerService } from "./generated/services/TripControllerService";
import { AuthControllerService } from "./generated/services/AuthControllerService";
import { AddressControllerService } from "./generated/services/AddressControllerService";
import type { TripCreationRequest } from "./generated/models/TripCreationRequest";

// Attach JWT from localStorage to every request automatically
OpenAPI.TOKEN = async () => localStorage.getItem("token") ?? "";

// Auth
export const register = (username: string, email: string, password: string) =>
    AuthControllerService.createUser({ username, email, password });

// Trips
export const getTrips = (startAddress: string) =>
    TripControllerService.getAvailableTripsByOrigin(startAddress);

export const createTrip = (request: TripCreationRequest) =>
    TripControllerService.create(request);

export const getMyTrips = (timeFilter: "ALL" | "HISTORICAL" | "UPCOMING") =>
    TripControllerService.getMyTripsAsDriver(timeFilter);

export const getMyParticipations = (timeFilter: "ALL" | "HISTORICAL" | "UPCOMING") =>
    TripControllerService.getMyParticipations(timeFilter);

export const joinTrip = (tripId: number) =>
    TripControllerService.participateInTrip(tripId);

export const getTripParticipants = (tripId: number) =>
    TripControllerService.getTripParticipants(tripId);

export const setParticipantStatus = (participantId: number, status: "APPROVED" | "REJECTED") =>
    TripControllerService.setParticipantStatus(participantId, status);

// Address search
export const searchAddress = (query: string) =>
    AddressControllerService.getAddresses(query);
