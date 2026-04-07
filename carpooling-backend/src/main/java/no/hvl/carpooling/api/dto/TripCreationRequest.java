package no.hvl.carpooling.api.dto;

import java.time.ZonedDateTime;

public record TripCreationRequest(
        String startAddress,
        String destinationAddress,
        ZonedDateTime departureTimeInIsoFormat,
        Integer seatsAvailable
) { }
