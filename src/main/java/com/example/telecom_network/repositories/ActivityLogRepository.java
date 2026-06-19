package com.example.telecom_network.repositories;

import com.example.telecom_network.models.ActivityLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends MongoRepository<ActivityLog, String> {
    List<ActivityLog> findByUserIdOrderByTimestampDesc(String userId);
    List<ActivityLog> findByUserMatriculeOrderByTimestampDesc(String matricule);
    List<ActivityLog> findAllByOrderByTimestampDesc();
}
