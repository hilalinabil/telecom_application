package com.example.telecom_network.adapters.out.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "chemins")
public class CheminDocument {
    @Id
    private String id;
    private String source;
    private String destination;
    private String longueur;
    private String statut;
    private List<GpsPointDocument> gpsPoints;
}
