package no.hvl.carpooling.persistence.repository;

import no.hvl.carpooling.persistence.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> { }

