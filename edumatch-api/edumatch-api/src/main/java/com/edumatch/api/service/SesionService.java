package com.edumatch.api.service;

import com.edumatch.api.entity.*;
import com.edumatch.api.exception.ResourceNotFoundException;
import com.edumatch.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SesionService {

    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final TutorRepository tutorRepository;
    private final SubjectRepository subjectRepository;
    private final AvailabilitySlotRepository availabilitySlotRepository;

    public List<Session> listarPorEstudiante(String studentId) {
        return sessionRepository.findByStudentIdOrderBySessionDateDesc(studentId);
    }

    public List<Session> listarPorTutor(String tutorId) {
        return sessionRepository.findByTutorIdOrderBySessionDateDesc(tutorId);
    }

    public Session obtener(String id) {
        return sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sesión no encontrada: " + id));
    }

    public Session crear(Session request) {
        return sessionRepository.save(request);
    }

    public Session cambiarEstado(String id, String estado) {
        Session session = obtener(id);
        session.setStatus(estado.toUpperCase());
        return sessionRepository.save(session);
    }
}
