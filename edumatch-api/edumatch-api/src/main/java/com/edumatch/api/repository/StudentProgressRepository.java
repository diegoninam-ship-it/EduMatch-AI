package com.edumatch.api.repository;

import com.edumatch.api.entity.StudentProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentProgressRepository extends JpaRepository<StudentProgress, String> {
    List<StudentProgress> findByStudentId(String studentId);
    Optional<StudentProgress> findByStudentIdAndTopicId(String studentId, String topicId);
}
