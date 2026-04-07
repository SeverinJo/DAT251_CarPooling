package no.hvl.carpooling.persistence.repository;

import no.hvl.carpooling.persistence.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Integer> {

    /**
     * A trip is considered "available" when the number of APPROVED participants is strictly less than seats_available.
     * Native query is used to keep the query simple and efficient.
     */
    @Query(
        value = """
            SELECT t.*
            FROM trips t
            WHERE lower(t.origin_municipality) = lower(:originMunicipality)
              AND t.departure_time > CURRENT_TIMESTAMP
              AND (
                    SELECT count(*)
                    FROM trip_participants tp
                    WHERE tp.trip_id = t.id
                      AND tp.status = 'APPROVED'
                  ) < t.seats_available
            """,
        nativeQuery = true
    )
    List<Trip> findAvailableTripsByOrigin(@Param("originMunicipality") String originMunicipality);

}
