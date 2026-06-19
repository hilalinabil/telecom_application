package com.example.telecom_network.models;

import com.example.telecom_network.models.enums.NetworkStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "repartiteurs")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Repartiteur {

    @Id
    private String id;

    private String name;
    private String datacenterId;
    private Integer nbPorts;
    private Integer usedPorts;
    private Integer availablePorts;
    private String ipAddress;
    private Double latitude;
    private Double longitude;
    private NetworkStatus status;
    private String zone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
