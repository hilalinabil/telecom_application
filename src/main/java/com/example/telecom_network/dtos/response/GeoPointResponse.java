package com.example.telecom_network.dtos.response;

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
public class GeoPointResponse {
    private String id;
    private String pathId;
    private Integer pointNumber;
    private Double latitude;
    private Double longitude;
    private Double altitude;
    private String description;
    private LocalDateTime createdAt;
}
