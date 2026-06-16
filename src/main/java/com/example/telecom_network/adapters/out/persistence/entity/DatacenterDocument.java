package com.example.telecom_network.adapters.out.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "datacenters")
public class DatacenterDocument {
    @Id
    private String id;
    private String nom;
    private String localisation;
    private Integer capacite;
    private Double latitude;
    private Double longitude;
}
