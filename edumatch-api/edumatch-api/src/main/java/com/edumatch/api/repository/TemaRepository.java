package com.edumatch.api.repository;

import com.edumatch.api.entity.Tema;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TemaRepository extends JpaRepository<Tema, Integer> {
    List<Tema> findByModuloIdModuloOrderByOrdenAsc(Integer idModulo);
}
