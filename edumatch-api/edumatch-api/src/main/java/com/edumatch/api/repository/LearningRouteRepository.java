package com.edumatch.api.repository;

import com.edumatch.api.entity.LearningRoute;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LearningRouteRepository extends JpaRepository<LearningRoute, String> {
    List<LearningRoute> findByStudentId(String studentId);
}
