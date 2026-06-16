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
@Document(collection = "boites_clients")
public class BoiteClientDocument {
    @Id
    private String id;
    private String type;
    private String splitterId;
    private Integer portsUtilises;
    private Double latitude;
    private Double longitude;
}
