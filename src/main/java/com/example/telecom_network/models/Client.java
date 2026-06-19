package com.example.telecom_network.models;

import com.example.telecom_network.models.enums.ClientStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "clients")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Client {

    @Id
    private String id;

    private String customerNumber;
    private String fullName;
    private String phone;
    private String email;
    private String address;
    private String clientBoxId;
    private Integer assignedPort;
    private String subscriptionType;
    private ClientStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
