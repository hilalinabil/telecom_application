package com.example.telecom_network.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Splitter {
    private String id;
    private String ratio; // e.g. "1:16"
    private String repartiteurId;
    private Integer nbSorties;
    private Double latitude;
    private Double longitude;
}
