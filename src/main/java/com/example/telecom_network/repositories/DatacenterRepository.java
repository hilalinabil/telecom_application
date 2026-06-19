package com.example.telecom_network.repositories;

import com.example.telecom_network.models.Datacenter;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DatacenterRepository extends MongoRepository<Datacenter, String> {
}
