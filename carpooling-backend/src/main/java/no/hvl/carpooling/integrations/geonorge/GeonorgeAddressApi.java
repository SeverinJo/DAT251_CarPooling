package no.hvl.carpooling.integrations.geonorge;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class GeonorgeAddressApi {

    private final RestTemplate restTemplate;
    private final String url;

    public GeonorgeAddressApi(
        @Qualifier("geonorgeRestTemplate") RestTemplate restTemplate,
        @Value("${carpooling.integrations.geonorge.url}") String url
    ) {
        this.restTemplate = restTemplate;
        if (url == null || url.isBlank()) {
            throw new IllegalStateException("Missing required property: carpooling.integrations.geonorge.url");
        }
        this.url = url;
    }

    /**
     * Makes a call to Geonorge's search endpoint to search among valid address in Norway.
     *
     * @param searchQuery The address to search for
     * @throws GeonorgeNotAvailableException For both 4xx and 5xx cases
     * @return A list of max 10 matching address and metadata, null otherwise
     */
    public AddressSearchResponse search(String searchQuery) throws GeonorgeNotAvailableException {
        try {
            var uri = UriComponentsBuilder
                .fromUriString(url)
                .pathSegment("sok")
                .queryParam("sok", "{searchQuery}")
                .queryParam("treffPerSide", 10)
                .queryParam("side", 0)
                .buildAndExpand(searchQuery)
                .toUri();

            var response = restTemplate.getForEntity(uri, AddressSearchResponse.class);
            return response.getBody();
        }
        catch (RestClientException e) {
            throw new GeonorgeNotAvailableException("Geonorge call failed", e);
        }
    }

}
