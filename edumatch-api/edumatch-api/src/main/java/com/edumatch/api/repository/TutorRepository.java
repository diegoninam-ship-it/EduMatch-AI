package com.edumatch.api.repository;

import com.edumatch.api.entity.Tutor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TutorRepository extends JpaRepository<Tutor, String> {
    List<Tutor> findByIsAvailableTrue();
    Optional<Tutor> findByUserId(String userId);
}
