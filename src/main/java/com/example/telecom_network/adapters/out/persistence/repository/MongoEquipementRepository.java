package com.example.telecom_network.adapters.out.persistence.repository;

import com.example.telecom_network.adapters.out.persistence.entity.EquipementDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MongoEquipementRepository extends MongoRepository<EquipementDocument, String> {
}
