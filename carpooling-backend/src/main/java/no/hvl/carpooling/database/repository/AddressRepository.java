package no.hvl.carpooling.database.repository;

import no.hvl.carpooling.database.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> { }

