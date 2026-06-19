package com.example.telecom_network.repositories;

import com.example.telecom_network.models.FibrePath;
import com.example.telecom_network.models.enums.DestinationType;
import com.example.telecom_network.models.enums.FibreStatus;
import com.example.telecom_network.models.enums.SourceType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FibrePathRepository extends MongoRepository<FibrePath, String> {
    List<FibrePath> findByStatus(FibreStatus status);
    List<FibrePath> findBySourceTypeAndSourceId(SourceType sourceType, String sourceId);
    List<FibrePath> findByDestinationTypeAndDestinationId(DestinationType destinationType, String destinationId);
}
