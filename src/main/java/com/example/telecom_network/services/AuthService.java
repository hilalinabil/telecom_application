package com.example.telecom_network.services;

import com.example.telecom_network.dtos.request.LoginRequest;
import com.example.telecom_network.dtos.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest loginRequest);
}
