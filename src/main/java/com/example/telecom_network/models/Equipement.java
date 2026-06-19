package com.example.telecom_network.models;

import com.example.telecom_network.models.enums.EquipementType;
import com.example.telecom_network.models.enums.NetworkStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "equipements")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Equipement {

    @Id
    private String id;

    private String name;
    private EquipementType type;
    private String manufacturer;
    private String model;
    private String serialNumber;
    private String ipAddress;
    private String macAddress;
    private String firmwareVersion;
    private NetworkStatus status;
    private String repartiteurId;
    private LocalDateTime installationDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
