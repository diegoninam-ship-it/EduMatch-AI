package com.edumatch.api.repository;

import com.edumatch.api.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, String> {
    List<Subject> findByIsActiveTrue();
}
