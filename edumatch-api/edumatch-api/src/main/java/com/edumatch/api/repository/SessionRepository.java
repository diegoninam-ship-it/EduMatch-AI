package com.edumatch.api.repository;

import com.edumatch.api.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SessionRepository extends JpaRepository<Session, String> {
    List<Session> findByStudentId(String studentId);
    List<Session> findByTutorId(String tutorId);
    List<Session> findByStudentIdOrderBySessionDateDesc(String studentId);
    List<Session> findByTutorIdOrderBySessionDateDesc(String tutorId);
}
