package com.example.telecom_network.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Chemin {
    private String id;
    private String source;      // id of the source equipment
    private String destination; // id of the destination equipment
    private String longueur;    // e.g. "2km"
    private String statut;      // e.g. "actif", "coupe"
    private List<GpsPoint> gpsPoints;
}
