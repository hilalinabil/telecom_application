package com.example.telecom_network.domain.ports.out;

import com.example.telecom_network.domain.model.User;
import java.util.Optional;

public interface UserRepositoryPort {
    User save(User user);
    Optional<User> findById(String id);
    Optional<User> findByUsername(String username);
}
