package no.hvl.carpooling.database.repository;

import no.hvl.carpooling.database.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
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

    @Query("""
        select t
        from Trip t
        join fetch t.driver
        join fetch t.origin
        join fetch t.destination
        where t.driver.id = :driverId
          and t.departureTime < :cutoff
        order by t.departureTime desc
        """)
    List<Trip> findAllWithDetailsByDriverIdAndDepartureTimeBefore(
        @Param("driverId") Integer driverId,
        @Param("cutoff") LocalDateTime cutoff
    );

    @Query("""
        select t
        from Trip t
        join fetch t.driver
        join fetch t.origin
        join fetch t.destination
        where t.driver.id = :driverId
          and t.departureTime >= :cutoff
        order by t.departureTime asc
        """)
    List<Trip> findAllWithDetailsByDriverIdAndDepartureTimeAfterOrEqual(
        @Param("driverId") Integer driverId,
        @Param("cutoff") LocalDateTime cutoff
    );

}
