package no.hvl.carpooling.api.trip;

import java.time.ZonedDateTime;

public record TripCreationRequest(
        String startAddress,
        String destinationAddress,
        ZonedDateTime departureTimeInIsoFormat,
        Integer seatsAvailable
) { }
