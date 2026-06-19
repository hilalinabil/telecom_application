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

@Document(collection = "datacenters")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Datacenter {

    @Id
    private String id;

    private String name;
    private String location;
    private Integer capacity;
    private Integer usedCapacity;
    private Double latitude;
    private Double longitude;
    private NetworkStatus status;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
