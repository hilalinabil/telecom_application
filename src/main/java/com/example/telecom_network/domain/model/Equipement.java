package com.example.telecom_network.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Equipement {
    private String id;
    private String type; // e.g. "OLT", "SWITCH"
    private String ip;
    private String statut; // e.g. "actif", "hs"
    private String repartiteurId;
}
