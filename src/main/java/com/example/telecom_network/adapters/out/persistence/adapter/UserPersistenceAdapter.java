package com.example.telecom_network.adapters.out.persistence.adapter;

import com.example.telecom_network.adapters.out.persistence.entity.UserDocument;
import com.example.telecom_network.adapters.out.persistence.repository.MongoUserRepository;
import com.example.telecom_network.domain.model.User;
import com.example.telecom_network.domain.ports.out.UserRepositoryPort;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class UserPersistenceAdapter implements UserRepositoryPort {

    private final MongoUserRepository repository;

    public UserPersistenceAdapter(MongoUserRepository repository) {
        this.repository = repository;
    }

    @Override
    public User save(User user) {
        UserDocument doc = toDocument(user);
        UserDocument saved = repository.save(doc);
        return toDomain(saved);
    }

    @Override
    public Optional<User> findById(String id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return repository.findByUsername(username).map(this::toDomain);
    }

    private UserDocument toDocument(User u) {
        if (u == null) return null;
        return UserDocument.builder()
                .id(u.getId())
                .username(u.getUsername())
                .password(u.getPassword())
                .role(u.getRole())
                .build();
    }

    private User toDomain(UserDocument u) {
        if (u == null) return null;
        return User.builder()
                .id(u.getId())
                .username(u.getUsername())
                .password(u.getPassword())
                .role(u.getRole())
                .build();
    }
}
