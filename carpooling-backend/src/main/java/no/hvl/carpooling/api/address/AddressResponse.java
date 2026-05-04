package no.hvl.carpooling.api.address;

import java.math.BigDecimal;

public record AddressResponse(
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

