package com.edumatch.api.repository;

import com.edumatch.api.entity.LearningRouteTopic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LearningRouteTopicRepository extends JpaRepository<LearningRouteTopic, String> {
    List<LearningRouteTopic> findByLearningRouteIdOrderByOrder(String learningRouteId);
}
