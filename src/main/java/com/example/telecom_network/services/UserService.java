package com.example.telecom_network.services;

import com.example.telecom_network.dtos.request.PasswordChangeRequest;
import com.example.telecom_network.dtos.request.UserCreateRequest;
import com.example.telecom_network.dtos.response.UserResponse;
import com.example.telecom_network.security.UserPrincipal;

import java.util.List;

public interface UserService {

    UserResponse createUser(UserCreateRequest request, UserPrincipal currentUser);

    void changePassword(PasswordChangeRequest request, UserPrincipal currentUser);

    void disableUser(String userId, UserPrincipal currentUser);

    List<UserResponse> getAllUsers();

    UserResponse getUserById(String id);
}
