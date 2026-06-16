package com.example.telecom_network.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoiteClient {
    private String id;
    private String type; // e.g. "16FO", "24FO"
    private String splitterId;
    private Integer portsUtilises;
    private Double latitude;
    private Double longitude;
}
