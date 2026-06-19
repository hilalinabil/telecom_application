package com.example.telecom_network.models;

import com.example.telecom_network.models.enums.NetworkStatus;
import com.example.telecom_network.models.enums.SplitterRatio;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "splitters")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Splitter {

    @Id
    private String id;

    private String name;
    private SplitterRatio ratio;
    private Integer nbOutputs;
    private Integer usedOutputs;
    private Integer availableOutputs;
    private String repartiteurId;
    private Double latitude;
    private Double longitude;
    private NetworkStatus status;
    private LocalDateTime installationDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
