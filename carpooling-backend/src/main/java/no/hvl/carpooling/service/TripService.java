package no.hvl.carpooling.service;

import jakarta.transaction.Transactional;
import jakarta.validation.ValidationException;
import no.hvl.carpooling.integrations.geonorge.GeonorgeAddressDto;
import no.hvl.carpooling.persistence.entity.Trip;
import no.hvl.carpooling.persistence.entity.TripParticipant;
import no.hvl.carpooling.persistence.entity.TripParticipantStatus;
import no.hvl.carpooling.persistence.entity.User;
import no.hvl.carpooling.persistence.repository.TripParticipantRepository;
import no.hvl.carpooling.persistence.repository.TripRepository;
import no.hvl.carpooling.service.domain.TripParticipationTimeFilter;
import no.hvl.carpooling.service.domain.TripParticipationTuple;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import static jakarta.transaction.Transactional.TxType.REQUIRES_NEW;


@Service
public class TripService {

    private static final int MIN_NUMBER_OF_AVAILABLE_SEATS = 1;
    private static final int MAX_NUMBER_OF_AVAILABLE_SEATS = 6;

    private final TripRepository tripRepository;
    private final TripParticipantRepository tripParticipantRepository;
    private final AddressService addressService;

    public TripService(
        TripRepository tripRepository,
        TripParticipantRepository tripParticipantRepository,
        AddressService addressService
    ) {
        this.tripRepository = tripRepository;
        this.tripParticipantRepository = tripParticipantRepository;
        this.addressService = addressService;
    }

    @Transactional(value = REQUIRES_NEW)
    public Trip createTrip (
        String startAddress,
        String destinationAddress,
        ZonedDateTime departureTimeInIsoFormat,
        Integer seatsAvailable,
        User user
    ) {
        if (user == null || user.getId() == null) {
            throw new ValidationException("A valid user must be provided");
        }

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
        trip.setDriver(user);
        trip.setDepartureTime(departureTimeInIsoFormat.toLocalDateTime());
        trip.setSeatsAvailable(seatsAvailable);
        trip.setOriginMunicipality(savedStartAddress.getMunicipality());

        return tripRepository.save(trip);
    }

    @Transactional(value = REQUIRES_NEW)
    public TripParticipant addParticipantToTrip(Integer tripId, User user) {
        if (tripId == null) {
            throw new ValidationException("A valid tripId must be provided");
        }
        if (user == null || user.getId() == null) {
            throw new ValidationException("A valid user must be provided");
        }

        var trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new ValidationException("Trip not found"));

        if (trip.getDriver() != null && user.getId().equals(trip.getDriver().getId())) {
            throw new ValidationException("Trip owner can not be added as a participant");
        }

        var existing = tripParticipantRepository.findByTripIdAndUserId(tripId, user.getId());
        if (existing.isPresent()) {
            throw new ValidationException("User is already a participant (or has a pending request) for this trip");
        }

        var participant = new TripParticipant();
        participant.setTrip(trip);
        participant.setUser(user);
        participant.setStatus(TripParticipantStatus.PENDING);

        return tripParticipantRepository.save(participant);
    }

    @Transactional
    public List<TripParticipationTuple> getMyParticipations(User user, TripParticipationTimeFilter timeFilter) {
        if (user == null || user.getId() == null) {
            throw new ValidationException("A valid user must be provided");
        }
        if (timeFilter == null) {
            throw new ValidationException("A valid timeFilter must be provided");
        }

        var now = LocalDateTime.now();
        List<TripParticipant> participations = switch (timeFilter) {
            case HISTORICAL -> tripParticipantRepository.findAllWithTripByUserIdAndDepartureTimeBefore(user.getId(), now);
            case UPCOMING -> tripParticipantRepository.findAllWithTripByUserIdAndDepartureTimeAfterOrEqual(user.getId(), now);
            case ALL -> {
                var upcoming = tripParticipantRepository.findAllWithTripByUserIdAndDepartureTimeAfterOrEqual(user.getId(), now);
                var historical = tripParticipantRepository.findAllWithTripByUserIdAndDepartureTimeBefore(user.getId(), now);

                var all = new ArrayList<TripParticipant>(
                    (upcoming != null ? upcoming.size() : 0) + (historical != null ? historical.size() : 0)
                );
                if (upcoming != null && !upcoming.isEmpty()) {
                    all.addAll(upcoming);
                }
                if (historical != null && !historical.isEmpty()) {
                    all.addAll(historical);
                }
                yield all;
            }
        };

        if (participations == null || participations.isEmpty()) {
            return List.of();
        }

        return participations.stream()
            .map(tp -> new TripParticipationTuple(tp.getTrip(), tp))
            .toList();
    }

    @Transactional(value = REQUIRES_NEW)
    public TripParticipant setParticipantStatus(Integer tripParticipantId, TripParticipantStatus newStatus, User user) {
        if (tripParticipantId == null) {
            throw new ValidationException("A valid tripParticipantId must be provided");
        }

        if (newStatus == null || newStatus == TripParticipantStatus.PENDING) {
            throw new ValidationException("Status must be APPROVED or REJECTED");
        }

        if (user == null || user.getId() == null) {
            throw new ValidationException("A valid user must be provided");
        }

        var participant = tripParticipantRepository.findById(tripParticipantId)
            .orElseThrow(() -> new ValidationException("Trip participant not found"));

        var trip = participant.getTrip();
        if (trip == null || trip.getDriver() == null || trip.getDriver().getId() == null) {
            throw new ValidationException("Trip owner not found for participant");
        }

        if (!user.getId().equals(trip.getDriver().getId())) {
            throw new ValidationException("Only the trip owner can approve or reject participants");
        }

        if (participant.getStatus() != TripParticipantStatus.PENDING) {
            throw new ValidationException("Only pending participation requests can be approved or rejected");
        }

        if (newStatus == TripParticipantStatus.APPROVED) {
            var approvedCount = tripParticipantRepository.countByTripIdAndStatus(
                trip.getId(),
                TripParticipantStatus.APPROVED
            );
            if (approvedCount >= trip.getSeatsAvailable()) {
                throw new ValidationException("No available seats left for this trip");
            }
        }

        participant.setStatus(newStatus);
        participant.setUpdatedAt(LocalDateTime.now());
        return tripParticipantRepository.save(participant);
    }

    @Transactional
    public List<TripParticipant> getParticipantsByStatus(Integer tripId, TripParticipantStatus status, User user) {
        if (tripId == null) {
            throw new ValidationException("A valid tripId must be provided");
        }

        if (status == null) {
            throw new ValidationException("A valid status must be provided");
        }

        if (user == null || user.getId() == null) {
            throw new ValidationException("A valid user must be provided");
        }

        var trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new ValidationException("Trip not found"));

        if (trip.getDriver() == null || trip.getDriver().getId() == null) {
            throw new ValidationException("Trip owner not found");
        }

        if (!user.getId().equals(trip.getDriver().getId())) {
            throw new ValidationException("Only the trip owner can view all trip participants");
        }

        return tripParticipantRepository.findAllByTripIdAndStatus(tripId, status);
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
