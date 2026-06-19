package com.example.telecom_network.services;

import com.example.telecom_network.models.ActivityLog;
import java.util.List;

public interface ActivityLogService {
    void log(String action, String targetType, String targetId, String details);
    List<ActivityLog> getAllLogs();
    List<ActivityLog> getLogsByUser(String userId);
    List<ActivityLog> getLogsByMatricule(String matricule);
}
