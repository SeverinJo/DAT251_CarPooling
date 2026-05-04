package no.hvl.carpooling.api.trip;

import no.hvl.carpooling.database.entity.TripParticipantStatus;

import java.time.LocalDateTime;

public record TripParticipantResponse(
    Integer id,
    Integer userId,
    String username,
    TripParticipantStatus status,
    LocalDateTime requestedAt,
    LocalDateTime updatedAt
) { }

