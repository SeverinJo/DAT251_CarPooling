package no.hvl.carpooling.integrations.geonorge;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record AddressSearchResponse(
        @JsonProperty("metadata")
        Metadata metadata,
        @JsonProperty("adresser")
        List<Address> addresses
) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Metadata(
            @JsonProperty("viserFra")
            Integer showingFrom,
            @JsonProperty("asciiKompatibel")
            Boolean asciiCompatible,
            @JsonProperty("treffPerSide")
            Integer hitsPerPage,
            @JsonProperty("viserTil")
            Integer showingTo,
            @JsonProperty("side")
            Integer page,
            @JsonProperty("sokeStreng")
            String searchString,
            @JsonProperty("totaltAntallTreff")
            Integer totalHits
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Address(
            @JsonProperty("adressenavn")
            String addressName,
            @JsonProperty("adressetekst")
            String addressText,
            @JsonProperty("adressetilleggsnavn")
            String addressSupplementaryName,
            @JsonProperty("adressekode")
            Integer addressCode,
            @JsonProperty("nummer")
            Integer number,
            @JsonProperty("bokstav")
            String letter,
            @JsonProperty("kommunenummer")
            String municipalityNumber,
            @JsonProperty("kommunenavn")
            String municipalityName,
            @JsonProperty("gardsnummer")
            Integer cadastralUnitNumber,
            @JsonProperty("bruksnummer")
            Integer propertyUnitNumber,
            @JsonProperty("festenummer")
            Integer leaseNumber,
            @JsonProperty("undernummer")
            Integer subNumber,
            @JsonProperty("bruksenhetsnummer")
            List<String> unitNumbers,
            @JsonProperty("objtype")
            String objectType,
            @JsonProperty("poststed")
            String city,
            @JsonProperty("postnummer")
            String postalCode,
            @JsonProperty("adressetekstutenadressetilleggsnavn")
            String addressTextWithoutSupplementaryName,
            @JsonProperty("stedfestingverifisert")
            Boolean locationVerified,
            @JsonProperty("representasjonspunkt")
            RepresentativePoint representativePoint,
            @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
            @JsonProperty("oppdateringsdato")
            LocalDateTime updatedAt
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record RepresentativePoint(
            @JsonProperty("epsg")
            String epsg,
            @JsonProperty("lat")
            Double latitude,
            @JsonProperty("lon")
            Double longitude
    ) {}
}
