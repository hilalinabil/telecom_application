package com.example.telecom_network.dtos.response;

import com.example.telecom_network.models.enums.EquipementType;
import com.example.telecom_network.models.enums.NetworkStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EquipementResponse {
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
