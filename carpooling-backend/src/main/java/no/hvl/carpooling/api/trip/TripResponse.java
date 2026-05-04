package no.hvl.carpooling.api.trip;

import java.math.BigDecimal;

import java.time.LocalDateTime;

public record TripResponse(
        Integer id,
        Integer driverId,
        String driverUsername,
        Address origin,
        Address destination,
        String originMunicipality,
        LocalDateTime departureTime,
        Integer seatsAvailable,
        LocalDateTime createdAt
) {

    /**
     * Trip-scoped address view to avoid coupling the trip API to the address API.
     * Keep fields stable to preserve JSON shape.
     */
    public record Address(
        Long id,
        String addressName,
        Integer number,
        String letter,
        String municipality,
        String city,
        String postalCode,
        String epsg,
        BigDecimal latitude,
        BigDecimal longitude
    ) { }
}
