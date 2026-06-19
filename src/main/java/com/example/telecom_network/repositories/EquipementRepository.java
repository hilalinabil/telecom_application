package com.example.telecom_network.repositories;

import com.example.telecom_network.models.Equipement;
import com.example.telecom_network.models.enums.NetworkStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipementRepository extends MongoRepository<Equipement, String> {
    List<Equipement> findByStatus(NetworkStatus status);
    List<Equipement> findByRepartiteurId(String repartiteurId);
    List<Equipement> findByRepartiteurIdIn(List<String> repartiteurIds);
    long countByStatus(NetworkStatus status);
}
