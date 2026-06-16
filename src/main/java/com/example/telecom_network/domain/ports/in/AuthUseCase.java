package com.example.telecom_network.domain.ports.in;

import com.example.telecom_network.domain.model.User;
import java.util.Optional;

public interface AuthUseCase {
    User register(User user);
    String login(String username, String password);
    Optional<User> getByUsername(String username);
}
