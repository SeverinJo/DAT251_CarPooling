package no.hvl.carpooling.api.trip;

import no.hvl.carpooling.database.entity.TripParticipantStatus;

import java.time.LocalDateTime;

public record TripParticipationResponse(
    Integer id,
    TripParticipantStatus status,
    LocalDateTime requestedAt,
    LocalDateTime updatedAt,
    TripResponse trip
) { }

