package com.edumatch.api.repository;

import com.edumatch.api.entity.DisponibilidadTutor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DisponibilidadTutorRepository extends JpaRepository<DisponibilidadTutor, Long> {
    List<DisponibilidadTutor> findByTutorIdTutor(Long idTutor);
    List<DisponibilidadTutor> findByTutorIdTutorAndDiaSemana(Long idTutor, String diaSemana);
}
