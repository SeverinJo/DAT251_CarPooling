package no.hvl.carpooling.api.controllers;

import no.hvl.carpooling.api.dto.AddressDto;
import no.hvl.carpooling.service.TripService;
import no.hvl.carpooling.api.dto.TripCreationRequest;
import no.hvl.carpooling.api.dto.TripDto;
import no.hvl.carpooling.persistence.entity.Address;
import no.hvl.carpooling.persistence.entity.Trip;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    @Autowired
    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @PostMapping
    public ResponseEntity<TripDto> create(@RequestBody TripCreationRequest request) {

        // todo: get user principal from token

        var trip = tripService.createTrip(
            request.startAddress(),
            request.destinationAddress(),
            request.departureTimeInIsoFormat(),
            request.seatsAvailable(),
            null // todo: give user to service
        );

        var response = new TripDto(
            trip.getId(),
            trip.getDriver().getId(),
            trip.getDriver().getUsername(),
            map(trip.getOrigin()),
            map(trip.getDestination()),
            trip.getOriginMunicipality(),
            trip.getDepartureTime(),
            trip.getSeatsAvailable(),
            trip.getCreatedAt()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<TripDto> getAvailableTripsByOrigin(@RequestParam String startAddress) {
        var availableTrips = tripService.findAvailableTrips(startAddress);
        return map(availableTrips);
    }

    private List<TripDto> map(List<Trip> trips) {
        if (trips == null || trips.isEmpty()) {
            return List.of();
        }

        return trips.stream()
            .map(trip -> new TripDto(
                trip.getId(),
                trip.getDriver() != null ? trip.getDriver().getId() : null,
                trip.getDriver() != null ? trip.getDriver().getUsername() : null,
                map(trip.getOrigin()),
                map(trip.getDestination()),
                trip.getOriginMunicipality(),
                trip.getDepartureTime(),
                trip.getSeatsAvailable(),
                trip.getCreatedAt()
            ))
            .toList();
    }

    private AddressDto map(Address address) {
        if (address == null) {
            return null;
        }

        return new AddressDto(
            address.getId(),
            address.getAddressName(),
            address.getNumber(),
            address.getLetter(),
            address.getMunicipality(),
            address.getCity(),
            address.getPostalCode(),
            address.getEpsg(),
            address.getLatitude(),
            address.getLongitude()
        );
    }

}
