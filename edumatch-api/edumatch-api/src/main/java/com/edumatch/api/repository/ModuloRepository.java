package com.edumatch.api.repository;

import com.edumatch.api.entity.Modulo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ModuloRepository extends JpaRepository<Modulo, Integer> {
    List<Modulo> findByMateriaIdMateriaOrderByOrdenAsc(Integer idMateria);
}
