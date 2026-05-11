package com.edumatch.api.repository;

import com.edumatch.api.entity.TutorMateria;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TutorMateriaRepository extends JpaRepository<TutorMateria, TutorMateria.TutorMateriaId> {
    List<TutorMateria> findByTutorIdTutor(Long idTutor);
    List<TutorMateria> findByMateriaIdMateria(Integer idMateria);
}
