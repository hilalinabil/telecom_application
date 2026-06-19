package com.example.telecom_network.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "activity_logs")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ActivityLog {

    @Id
    private String id;

    private String userId;
    private String userMatricule;
    private String userFullName;
    private String action; // CREATE, UPDATE, DELETE
    private String targetType; // DATACENTER, REPARTITEUR, etc.
    private String targetId;
    private String details;
    private LocalDateTime timestamp;
}
