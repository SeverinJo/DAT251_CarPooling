package no.hvl.carpooling.api.trip;

import no.hvl.carpooling.security.UserPrincipal;
import no.hvl.carpooling.service.trip.TripService;
import no.hvl.carpooling.database.entity.Address;
import no.hvl.carpooling.database.entity.Trip;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<TripResponse> create(
        @RequestBody TripCreationRequest request,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        var trip = tripService.createTrip(
            request.startAddress(),
            request.destinationAddress(),
            request.departureTimeInIsoFormat(),
            request.seatsAvailable(),
            principal.user()
        );

        var response = new TripResponse(
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
    public List<TripResponse> getAvailableTripsByOrigin(@RequestParam String startAddress) {
        var availableTrips = tripService.findAvailableTrips(startAddress);
        return map(availableTrips);
    }

    private List<TripResponse> map(List<Trip> trips) {
        if (trips == null || trips.isEmpty()) {
            return List.of();
        }

        return trips.stream()
            .map(trip -> new TripResponse(
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

    private TripResponse.Address map(Address address) {
        if (address == null) {
            return null;
        }

        return new TripResponse.Address(
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
