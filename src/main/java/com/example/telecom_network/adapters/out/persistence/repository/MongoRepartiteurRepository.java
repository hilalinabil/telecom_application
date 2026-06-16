package com.example.telecom_network.adapters.out.persistence.repository;

import com.example.telecom_network.adapters.out.persistence.entity.RepartiteurDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MongoRepartiteurRepository extends MongoRepository<RepartiteurDocument, String> {
}
