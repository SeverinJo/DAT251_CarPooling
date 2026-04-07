package no.hvl.carpooling.api.dto;

import java.math.BigDecimal;

public record AddressDto(
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
) {
}

