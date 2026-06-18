package com.example.telecom_network.dtos.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class RegisterResponseDto {

    private String firstName;
    private String lastName;
    private String email;
    private String matricule;
}
