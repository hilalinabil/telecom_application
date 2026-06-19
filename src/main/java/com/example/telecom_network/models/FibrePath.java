package com.example.telecom_network.models;

import com.example.telecom_network.models.enums.DestinationType;
import com.example.telecom_network.models.enums.FibreStatus;
import com.example.telecom_network.models.enums.SourceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "fibre_paths")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FibrePath {

    @Id
    private String id;

    private SourceType sourceType;
    private String sourceId;
    private DestinationType destinationType;
    private String destinationId;
    private String fibreType;
    private String cableReference;
    private Double lengthMeters;
    private Integer coreCount;
    private Integer usedCores;
    private Integer availableCores;
    private FibreStatus status;
    private LocalDateTime installationDate;
    private LocalDateTime lastMaintenance;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
