package com.example.telecom_network.dtos.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;

@Getter
@Setter
@Data

public class LoginResponseDto {
    private String matricule;
    private String token;

}
