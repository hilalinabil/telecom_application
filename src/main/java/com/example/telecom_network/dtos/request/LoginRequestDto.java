package com.example.telecom_network.dtos.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class LoginRequestDto {
    @NotBlank(message = "can't login without matricule")
    @Size(min =5, max = 50)
    private String matricule;

    @NotBlank(message= "can't login without passowrd")
    @Size(min = 8)
    private String password;

}
