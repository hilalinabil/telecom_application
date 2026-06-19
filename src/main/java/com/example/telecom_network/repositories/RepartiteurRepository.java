package com.example.telecom_network.repositories;

import com.example.telecom_network.models.Repartiteur;
import com.example.telecom_network.models.enums.NetworkStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepartiteurRepository extends MongoRepository<Repartiteur, String> {
    List<Repartiteur> findByZone(String zone);
    List<Repartiteur> findByDatacenterId(String datacenterId);
    long countByStatus(NetworkStatus status);
}
