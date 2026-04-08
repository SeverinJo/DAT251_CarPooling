package no.hvl.carpooling.integrations.geonorge;

/**
 * Minimal address representation for application/service use.
 * Keep integration-layer DTOs (Geonorge responses) separate from app DTOs.
 */
public record GeonorgeAddress(
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
