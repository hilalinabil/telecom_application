package com.example.telecom_network.repositories;

import com.example.telecom_network.models.ClientBox;
import com.example.telecom_network.models.enums.NetworkStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientBoxRepository extends MongoRepository<ClientBox, String> {
    List<ClientBox> findBySplitterId(String splitterId);
    List<ClientBox> findByZone(String zone);
    long countByStatus(NetworkStatus status);
}
