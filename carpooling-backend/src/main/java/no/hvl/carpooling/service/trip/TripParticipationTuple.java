package no.hvl.carpooling.service.trip;

import no.hvl.carpooling.database.entity.Trip;
import no.hvl.carpooling.database.entity.TripParticipant;

public record TripParticipationTuple(
    Trip trip,
    TripParticipant participation
) {}

