package no.hvl.carpooling.service;

import no.hvl.carpooling.integrations.geonorge.GeonorgeAddressApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AddressService {

    private final GeonorgeAddressApi geonorgeAddressApi;

    @Autowired
    public AddressService(GeonorgeAddressApi geonorgeAddressApi) {
        this.geonorgeAddressApi = geonorgeAddressApi;
    }

    // todo: add address business functions here

}
