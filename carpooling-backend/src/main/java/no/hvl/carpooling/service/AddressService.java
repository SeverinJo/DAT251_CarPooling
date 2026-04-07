package no.hvl.carpooling.service;

import no.hvl.carpooling.integrations.geonorge.GeonorgeAddressApi;
import no.hvl.carpooling.service.dto.AddressDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class AddressService {

    private final GeonorgeAddressApi geonorgeAddressApi;

    @Autowired
    public AddressService(GeonorgeAddressApi geonorgeAddressApi) {
        this.geonorgeAddressApi = geonorgeAddressApi;
    }

    public List<AddressDto> search(String query) {
        var response = geonorgeAddressApi.search(query);
        if (response == null || response.addresses() == null) {
            return Collections.emptyList();
        }

        return response.addresses().stream()
            .map(a -> new AddressDto(
                    a.addressName(),
                    a.number(),
                    a.letter(),
                    a.municipalityName(),
                    a.city(),
                    a.postalCode(),
                    a.representativePoint().epsg(),
                    a.representativePoint().latitude(),
                    a.representativePoint().longitude()
            ))
            .toList();
    }

    // todo: add address business functions here

}
