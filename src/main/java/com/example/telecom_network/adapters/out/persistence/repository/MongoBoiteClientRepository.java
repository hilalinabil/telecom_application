package com.example.telecom_network.adapters.out.persistence.repository;

import com.example.telecom_network.adapters.out.persistence.entity.BoiteClientDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MongoBoiteClientRepository extends MongoRepository<BoiteClientDocument, String> {
}
