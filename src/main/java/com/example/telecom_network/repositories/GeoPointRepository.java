package com.example.telecom_network.repositories;

import com.example.telecom_network.models.GeoPoint;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GeoPointRepository extends MongoRepository<GeoPoint, String> {
    List<GeoPoint> findByPathId(String pathId);
    List<GeoPoint> findByPathIdOrderByPointNumberAsc(String pathId);
    void deleteByPathId(String pathId);
}
