package no.hvl.carpooling.api.address;

import no.hvl.carpooling.integrations.geonorge.GeonorgeAddress;
import no.hvl.carpooling.service.address.AddressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("api/address")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping
    public ResponseEntity<List<AddressResponse>> getAddresses(@RequestParam String address) {
        var addressList = addressService.search(address);
        return ResponseEntity.ok(map(addressList));
    }

    // Suggestion for later:
    // todo: GET endpoint to return 5 latest start/origin addresses
    // todo: GET endpoint to return 5 latest stop/destination addresses

    private List<AddressResponse> map(List<GeonorgeAddress> addresses) {
        if (addresses == null) {
            return List.of();
        }

        return addresses.stream()
            .map(a -> new AddressResponse(
                null,
                a.addressName(),
                a.number(),
                a.letter(),
                a.municipality(),
                a.city(),
                a.postalCode(),
                a.epsg(),
                a.latitude() != null ? BigDecimal.valueOf(a.latitude()) : null,
                a.longitude() != null ? BigDecimal.valueOf(a.longitude()) : null
            ))
            .toList();
    }

}
