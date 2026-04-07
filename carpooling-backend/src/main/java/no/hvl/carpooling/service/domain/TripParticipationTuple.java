package no.hvl.carpooling.service.domain;

import no.hvl.carpooling.persistence.entity.Trip;
import no.hvl.carpooling.persistence.entity.TripParticipant;

public record TripParticipationTuple(
    Trip trip,
    TripParticipant participation
) {}

