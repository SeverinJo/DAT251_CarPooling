package no.hvl.carpooling.database.repository;

import no.hvl.carpooling.database.entity.TripParticipant;
import no.hvl.carpooling.database.entity.TripParticipantStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TripParticipantRepository extends JpaRepository<TripParticipant, Integer> {

    Optional<TripParticipant> findByTripIdAndUserId(Integer tripId, Integer userId);

    long countByTripIdAndStatus(Integer tripId, TripParticipantStatus status);

    List<TripParticipant> findAllByTripIdAndStatus(Integer tripId, TripParticipantStatus status);

    @Query("""
        select tp
        from TripParticipant tp
        join fetch tp.trip t
        where tp.user.id = :userId
          and t.departureTime < :cutoff
        order by t.departureTime desc
        """)
    List<TripParticipant> findAllWithTripByUserIdAndDepartureTimeBefore(
        @Param("userId") Integer userId,
        @Param("cutoff") LocalDateTime cutoff
    );

    @Query("""
        select tp
        from TripParticipant tp
        join fetch tp.trip t
        where tp.user.id = :userId
          and t.departureTime >= :cutoff
        order by t.departureTime asc
        """)
    List<TripParticipant> findAllWithTripByUserIdAndDepartureTimeAfterOrEqual(
        @Param("userId") Integer userId,
        @Param("cutoff") LocalDateTime cutoff
    );
}
