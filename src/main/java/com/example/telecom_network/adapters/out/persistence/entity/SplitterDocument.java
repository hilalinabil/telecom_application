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
@Document(collection = "splitters")
public class SplitterDocument {
    @Id
    private String id;
    private String ratio;
    private String repartiteurId;
    private Integer nbSorties;
    private Double latitude;
    private Double longitude;
}
