package no.hvl.carpooling.service.dto;

/**
 * Minimal address representation for application/service use.
 * Keep integration-layer DTOs (Geonorge responses) separate from app DTOs.
 */
public record AddressDto(
        String addressName,
        Integer number,
        String letter,
        String municipality,
        String city,
        String postalCode,
        String epsg,
        Double latitude,
        Double longitude
){ }
