package no.hvl.carpooling.service;

import jakarta.transaction.Transactional;
import no.hvl.carpooling.integrations.geonorge.GeonorgeAddressApi;
import no.hvl.carpooling.integrations.geonorge.GeonorgeAddressDto;
import no.hvl.carpooling.persistence.entity.Address;
import no.hvl.carpooling.persistence.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

import static jakarta.transaction.Transactional.TxType.REQUIRES_NEW;

@Service
public class AddressService {

    private final GeonorgeAddressApi geonorgeAddressApi;
    private final AddressRepository addressRepository;

    @Autowired
    public AddressService(
        GeonorgeAddressApi geonorgeAddressApi,
        AddressRepository addressRepository
    ) {
        this.geonorgeAddressApi = geonorgeAddressApi;
        this.addressRepository = addressRepository;
    }

    public List<GeonorgeAddressDto> search(String query) {
        var response = geonorgeAddressApi.search(query);
        if (response == null || response.addresses() == null) {
            return Collections.emptyList();
        }

        return response.addresses().stream()
            .map(a -> new GeonorgeAddressDto(
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

    @Transactional(REQUIRES_NEW)
    public Address saveAddress(GeonorgeAddressDto addressDto) {
        var probe = new Address();
        probe.setAddressName(addressDto.addressName());
        probe.setNumber(addressDto.number());
        probe.setLetter(addressDto.letter());
        probe.setMunicipality(addressDto.municipality());
        probe.setCity(addressDto.city());
        probe.setPostalCode(addressDto.postalCode());
        probe.setEpsg(addressDto.epsg());
        probe.setLatitude(BigDecimal.valueOf(addressDto.latitude()));
        probe.setLongitude(BigDecimal.valueOf(addressDto.longitude()));

        var matcher = ExampleMatcher
            .matchingAll()
            .withIgnorePaths("id", "latitude", "longitude");

        return addressRepository
            .findOne(Example.of(probe, matcher))
            .orElseGet(() -> addressRepository.save(probe));
    }

}
