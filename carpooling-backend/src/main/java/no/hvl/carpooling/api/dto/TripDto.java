package no.hvl.carpooling.api.dto;

import java.time.LocalDateTime;

public record TripDto(
        Integer id,
        Integer driverId,
        String driverUsername,
        AddressDto origin,
        AddressDto destination,
        String originMunicipality,
        LocalDateTime departureTime,
        Integer seatsAvailable,
        LocalDateTime createdAt
) {
}
