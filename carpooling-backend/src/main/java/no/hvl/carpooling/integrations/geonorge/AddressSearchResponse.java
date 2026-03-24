package no.hvl.carpooling.integrations.geonorge;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record AddressSearchResponse(
        Metadata metadata,
        List<Adresse> adresser
) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Metadata(
            Integer viserFra,
            Boolean asciiKompatibel,
            Integer treffPerSide,
            Integer viserTil,
            Integer side,
            String sokeStreng,
            Integer totaltAntallTreff
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Adresse(
            String adressenavn,
            String adressetekst,
            String adressetilleggsnavn,
            Integer adressekode,
            Integer nummer,
            String bokstav,
            String kommunenummer,
            String kommunenavn,
            Integer gardsnummer,
            Integer bruksnummer,
            Integer festenummer,
            Integer undernummer,
            List<String> bruksenhetsnummer,
            String objtype,
            String poststed,
            String postnummer,
            String adressetekstutenadressetilleggsnavn,
            Boolean stedfestingverifisert,
            Representasjonspunkt representasjonspunkt,
            @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
            LocalDateTime oppdateringsdato
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Representasjonspunkt(
            String epsg,
            Double lat,
            Double lon
    ) {}
}
