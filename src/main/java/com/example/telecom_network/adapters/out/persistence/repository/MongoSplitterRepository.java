package com.example.telecom_network.adapters.out.persistence.repository;

import com.example.telecom_network.adapters.out.persistence.entity.SplitterDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MongoSplitterRepository extends MongoRepository<SplitterDocument, String> {
}
