package com.edumatch.api.service;

import com.edumatch.api.entity.*;
import com.edumatch.api.exception.ResourceNotFoundException;
import com.edumatch.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TutorService {

    private final TutorRepository tutorRepository;
    private final TutorSubjectRepository tutorSubjectRepository;
    private final AvailabilitySlotRepository availabilitySlotRepository;
    private final SubjectRepository subjectRepository;

    public List<Tutor> listarTodos() {
        return tutorRepository.findAll();
    }

    public List<Tutor> listarDisponibles() {
        return tutorRepository.findByIsAvailableTrue();
    }

    public Tutor obtener(String id) {
        return tutorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tutor no encontrado: " + id));
    }

    public Tutor obtenerPorUsuario(String userId) {
        return tutorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Perfil de tutor no encontrado"));
    }

    public Tutor actualizarPerfil(String id, Tutor datos) {
        Tutor tutor = obtener(id);
        if (datos.getBiography() != null)     tutor.setBiography(datos.getBiography());
        if (datos.getExperienceYears() != null) tutor.setExperienceYears(datos.getExperienceYears());
        if (datos.getHourlyRate() != null)    tutor.setHourlyRate(datos.getHourlyRate());
        if (datos.getIsAvailable() != null)   tutor.setIsAvailable(datos.getIsAvailable());
        return tutorRepository.save(tutor);
    }

    public List<TutorSubject> listarMaterias(String tutorId) {
        return tutorSubjectRepository.findByTutorId(tutorId);
    }

    public TutorSubject agregarMateria(String tutorId, String subjectId) {
        Tutor tutor = obtener(tutorId);
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada: " + subjectId));
        TutorSubject ts = new TutorSubject();
        ts.setTutor(tutor);
        ts.setSubject(subject);
        return tutorSubjectRepository.save(ts);
    }

    @Transactional
    public void quitarMateria(String tutorId, String subjectId) {
        tutorSubjectRepository.deleteByTutorIdAndSubjectId(tutorId, subjectId);
    }

    public List<AvailabilitySlot> listarDisponibilidad(String tutorId) {
        return availabilitySlotRepository.findByTutorIdAndIsActiveTrue(tutorId);
    }

    public AvailabilitySlot agregarDisponibilidad(String tutorId, AvailabilitySlot slot) {
        Tutor tutor = obtener(tutorId);
        slot.setTutor(tutor);
        return availabilitySlotRepository.save(slot);
    }

    public void eliminarDisponibilidad(String slotId) {
        availabilitySlotRepository.deleteById(slotId);
    }
}
