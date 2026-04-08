package no.hvl.carpooling.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "trips")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "origin", nullable = false)
    private Address origin;

    @Column(name = "origin_municipality", nullable = false)
    private String originMunicipality;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "destination", nullable = false)
    private Address destination;

    @Column(name = "departure_time", nullable = false)
    private LocalDateTime departureTime;

    @Column(name = "seats_available", nullable = false)
    private Integer seatsAvailable;

    // Handled by DB default in Flyway migration.
    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public Trip() {
    }

    public Integer getId() {
        return id;
    }

    public User getDriver() {
        return driver;
    }

    public void setDriver(User driver) {
        this.driver = driver;
    }

    public Address getOrigin() {
        return origin;
    }

    public void setOrigin(Address origin) {
        this.origin = origin;
    }

    public String getOriginMunicipality() {
        return originMunicipality;
    }

    public void setOriginMunicipality(String originMunicipality) {
        this.originMunicipality = originMunicipality;
    }

    public Address getDestination() {
        return destination;
    }

    public void setDestination(Address destination) {
        this.destination = destination;
    }

    public LocalDateTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalDateTime departureTime) {
        this.departureTime = departureTime;
    }

    public int getSeatsAvailable() {
        return seatsAvailable;
    }

    public void setSeatsAvailable(int seatsAvailable) {
        this.seatsAvailable = seatsAvailable;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
