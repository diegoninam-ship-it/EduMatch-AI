package com.edumatch.api.service;

import com.edumatch.api.entity.Subject;
import com.edumatch.api.exception.ResourceNotFoundException;
import com.edumatch.api.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MateriaService {

    private final SubjectRepository subjectRepository;

    public List<Subject> listarActivas() {
        return subjectRepository.findByIsActiveTrue();
    }

    public List<Subject> listarTodas() {
        return subjectRepository.findAll();
    }

    public Subject obtener(String id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada: " + id));
    }
}
