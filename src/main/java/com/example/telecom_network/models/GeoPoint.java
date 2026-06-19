package com.example.telecom_network.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "geo_points")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GeoPoint {

    @Id
    private String id;

    private String pathId;
    private Integer pointNumber;
    private Double latitude;
    private Double longitude;
    private Double altitude;
    private String description;
    private LocalDateTime createdAt;
}
