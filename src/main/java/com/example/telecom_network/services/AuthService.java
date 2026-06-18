package com.example.telecom_network.services;

import com.example.telecom_network.dtos.request.LoginRequestDto;
import com.example.telecom_network.dtos.request.RegisterRequestDto;
import com.example.telecom_network.dtos.response.LoginResponseDto;
import com.example.telecom_network.dtos.response.RegisterResponseDto;

public interface AuthService {
    LoginResponseDto login(LoginRequestDto loginRequestDto);
    RegisterResponseDto register (RegisterRequestDto registerRequestDto);
}
