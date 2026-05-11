package com.edumatch.api.service;

import com.edumatch.api.entity.*;
import com.edumatch.api.exception.ResourceNotFoundException;
import com.edumatch.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RutaAprendizajeService {

    private final LearningRouteRepository routeRepository;
    private final LearningRouteTopicRepository routeTopicRepository;
    private final StudentProgressRepository progressRepository;
    private final StudentProfileRepository profileRepository;
    private final UserRepository userRepository;

    public List<LearningRoute> listarPorEstudiante(String studentId) {
        return routeRepository.findByStudentId(studentId);
    }

    public LearningRoute obtener(String id) {
        return routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ruta no encontrada: " + id));
    }

    public LearningRoute crear(LearningRoute route) {
        return routeRepository.save(route);
    }

    public LearningRoute cambiarEstado(String id, String estado) {
        LearningRoute route = obtener(id);
        route.setStatus(estado.toUpperCase());
        return routeRepository.save(route);
    }

    public List<LearningRouteTopic> listarTopicos(String routeId) {
        return routeTopicRepository.findByLearningRouteIdOrderByOrder(routeId);
    }

    public List<StudentProgress> listarProgreso(String studentId) {
        return progressRepository.findByStudentId(studentId);
    }

    public StudentProgress registrarProgreso(StudentProgress progress) {
        return progressRepository.findByStudentIdAndTopicId(
                progress.getStudent().getId(), progress.getTopic().getId()
        ).map(existing -> {
            existing.setProgressPercentage(progress.getProgressPercentage());
            existing.setCompleted(progress.getCompleted());
            return progressRepository.save(existing);
        }).orElseGet(() -> progressRepository.save(progress));
    }

    public StudentProfile obtenerPerfil(String studentId) {
        return profileRepository.findByStudentId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Perfil no encontrado"));
    }

    public StudentProfile guardarPerfil(StudentProfile profile) {
        return profileRepository.findByStudentId(profile.getStudent().getId())
                .map(existing -> {
                    existing.setSkillLevel(profile.getSkillLevel());
                    existing.setGoals(profile.getGoals());
                    existing.setPreferredLearningStyle(profile.getPreferredLearningStyle());
                    return profileRepository.save(existing);
                }).orElseGet(() -> profileRepository.save(profile));
    }
}
