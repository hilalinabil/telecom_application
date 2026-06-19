package com.example.telecom_network.services.impl;

import com.example.telecom_network.models.ActivityLog;
import com.example.telecom_network.models.User;
import com.example.telecom_network.repositories.ActivityLogRepository;
import com.example.telecom_network.security.UserPrincipal;
import com.example.telecom_network.services.ActivityLogService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActivityLogServiceImpl implements ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    public ActivityLogServiceImpl(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }

    @Override
    public void log(String action, String targetType, String targetId, String details) {
        String userId = "SYSTEM";
        String userMatricule = "SYSTEM-0001";
        String userFullName = "System Thread";

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
            User user = principal.getUser();
            if (user != null) {
                userId = user.getId();
                userMatricule = user.getMatricule();
                userFullName = user.getFirstName() + " " + user.getLastName();
            }
        }

        ActivityLog logEntry = ActivityLog.builder()
                .userId(userId)
                .userMatricule(userMatricule)
                .userFullName(userFullName)
                .action(action)
                .targetType(targetType)
                .targetId(targetId)
                .details(details)
                .timestamp(LocalDateTime.now())
                .build();

        activityLogRepository.save(logEntry);
    }

    @Override
    public List<ActivityLog> getAllLogs() {
        return activityLogRepository.findAllByOrderByTimestampDesc();
    }

    @Override
    public List<ActivityLog> getLogsByUser(String userId) {
        return activityLogRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    @Override
    public List<ActivityLog> getLogsByMatricule(String matricule) {
        return activityLogRepository.findByUserMatriculeOrderByTimestampDesc(matricule);
    }
}
