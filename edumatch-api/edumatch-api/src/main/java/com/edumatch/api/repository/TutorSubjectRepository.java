package com.edumatch.api.repository;

import com.edumatch.api.entity.TutorSubject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TutorSubjectRepository extends JpaRepository<TutorSubject, String> {
    List<TutorSubject> findByTutorId(String tutorId);
    void deleteByTutorIdAndSubjectId(String tutorId, String subjectId);
}
