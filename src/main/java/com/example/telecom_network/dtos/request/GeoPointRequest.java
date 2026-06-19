package com.example.telecom_network.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GeoPointRequest {
    private String pathId;
    private Integer pointNumber;
    private Double latitude;
    private Double longitude;
    private Double altitude;
    private String description;
}
