package com.example.telecom_network.adapters.out.persistence.repository;

import com.example.telecom_network.adapters.out.persistence.entity.CheminDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MongoCheminRepository extends MongoRepository<CheminDocument, String> {
}
