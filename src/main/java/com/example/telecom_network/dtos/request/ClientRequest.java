package com.example.telecom_network.dtos.request;

import com.example.telecom_network.models.enums.ClientStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClientRequest {
    private String customerNumber;
    private String fullName;
    private String phone;
    private String email;
    private String address;
    private String clientBoxId;
    private Integer assignedPort;
    private String subscriptionType;
    private ClientStatus status;
}
