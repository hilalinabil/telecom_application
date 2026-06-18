package com.example.telecom_network.repositories;

import com.example.telecom_network.models.User;
import com.example.telecom_network.models.enums.Role;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByMatricule(String matricule);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findFirstByRoleOrderByMatriculeDesc(Role role);
}
