package com.example.telecom_network.repositories;

import com.example.telecom_network.models.Splitter;
import com.example.telecom_network.models.enums.NetworkStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SplitterRepository extends MongoRepository<Splitter, String> {
    List<Splitter> findByRepartiteurId(String repartiteurId);
    long countByStatus(NetworkStatus status);
}
