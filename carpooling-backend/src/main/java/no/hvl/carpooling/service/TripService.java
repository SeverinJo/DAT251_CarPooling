package no.hvl.carpooling.service;

import jakarta.transaction.Transactional;
import jakarta.validation.ValidationException;
import no.hvl.carpooling.integrations.geonorge.GeonorgeAddressDto;
import no.hvl.carpooling.persistence.entity.Trip;
import no.hvl.carpooling.persistence.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.NoSuchElementException;

import static jakarta.transaction.Transactional.TxType.REQUIRES_NEW;


@Service
public class TripService {

    private static final int MIN_NUMBER_OF_AVAILABLE_SEATS = 1;
    private static final int MAX_NUMBER_OF_AVAILABLE_SEATS = 6;

    private final TripRepository tripRepository;
    private final AddressService addressService;

    public TripService(
        TripRepository tripRepository,
        AddressService addressService
    ) {
        this.tripRepository = tripRepository;
        this.addressService = addressService;
    }

    @Transactional(value = REQUIRES_NEW)
    public Trip createTrip (
        String startAddress,
        String destinationAddress,
        ZonedDateTime departureTimeInIsoFormat,
        Integer seatsAvailable
        // todo: get user principal (or just UserId)
    ) {
        GeonorgeAddressDto start, end;
        try {
            start = addressService.search(startAddress).getFirst();
            end = addressService.search(destinationAddress).getFirst();
        }
        catch (NoSuchElementException e) {
            throw new ValidationException("Either start or end address not found!");
        }

        if(departureTimeInIsoFormat.isBefore(ZonedDateTime.now())) {
            throw new ValidationException("You can not create a trip in the past!");
        }

        if(seatsAvailable < MIN_NUMBER_OF_AVAILABLE_SEATS || seatsAvailable > MAX_NUMBER_OF_AVAILABLE_SEATS) {
            throw new ValidationException(String.format(
                "Only %d to %d passengers are allowed!",
                MIN_NUMBER_OF_AVAILABLE_SEATS,
                MAX_NUMBER_OF_AVAILABLE_SEATS
            ));
        }

        var savedStartAddress = addressService.saveAddress(start);
        var savedEndAddress =  addressService.saveAddress(end);

        var trip = new Trip();
        trip.setOrigin(savedStartAddress);
        trip.setDestination(savedEndAddress);
        // trip.setDriver(); todo: get id from user principal
        trip.setDepartureTime(departureTimeInIsoFormat.toLocalDateTime());
        trip.setSeatsAvailable(seatsAvailable);
        trip.setOriginMunicipality(savedStartAddress.getMunicipality());

        return tripRepository.save(trip);
    }

    @Transactional
    public List<Trip> findAvailableTrips(String startAddress) {
        GeonorgeAddressDto start;
        try {
            start = addressService.search(startAddress).getFirst();
        }
        catch (NoSuchElementException e) {
            throw new ValidationException("Start address not found!");
        }

        var municipality = start.municipality();
        return tripRepository.findAvailableTripsByOrigin(municipality);
    }

}
