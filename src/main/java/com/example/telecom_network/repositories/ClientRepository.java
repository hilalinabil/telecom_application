package com.example.telecom_network.repositories;

import com.example.telecom_network.models.Client;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends MongoRepository<Client, String> {
    List<Client> findByClientBoxId(String clientBoxId);
    Optional<Client> findByCustomerNumber(String customerNumber);
    boolean existsByCustomerNumber(String customerNumber);
}
