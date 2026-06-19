package com.example.telecom_network.controllers;

import com.example.telecom_network.models.ActivityLog;
import com.example.telecom_network.services.ActivityLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    public ActivityLogController(ActivityLogService activityLogService) {
        this.activityLogService = activityLogService;
    }

    @GetMapping
    public ResponseEntity<List<ActivityLog>> getAllLogs() {
        List<ActivityLog> logs = activityLogService.getAllLogs();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ActivityLog>> getLogsByUser(@PathVariable String userId) {
        List<ActivityLog> logs = activityLogService.getLogsByUser(userId);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/user/matricule/{matricule}")
    public ResponseEntity<List<ActivityLog>> getLogsByMatricule(@PathVariable String matricule) {
        List<ActivityLog> logs = activityLogService.getLogsByMatricule(matricule);
        return ResponseEntity.ok(logs);
    }
}
