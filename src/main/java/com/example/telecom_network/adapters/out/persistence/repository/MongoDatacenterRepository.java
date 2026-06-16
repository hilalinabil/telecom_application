package com.example.telecom_network.adapters.out.persistence.repository;

import com.example.telecom_network.adapters.out.persistence.entity.DatacenterDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MongoDatacenterRepository extends MongoRepository<DatacenterDocument, String> {
}
