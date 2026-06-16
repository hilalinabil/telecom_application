package com.example.telecom_network.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Repartiteur {
    private String id;
    private String nom;
    private String datacenterId;
    private Integer nbPorts;
    private Double latitude;
    private Double longitude;
}
