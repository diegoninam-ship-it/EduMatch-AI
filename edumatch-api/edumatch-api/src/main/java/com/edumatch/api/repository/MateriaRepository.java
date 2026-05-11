package com.edumatch.api.repository;

import com.edumatch.api.entity.Materia;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MateriaRepository extends JpaRepository<Materia, Integer> {
    List<Materia> findByEstadoTrue();
}
