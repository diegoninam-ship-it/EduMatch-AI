package com.edumatch.api.repository;

import com.edumatch.api.entity.ProgresoTema;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProgresoTemaRepository extends JpaRepository<ProgresoTema, Long> {
    List<ProgresoTema> findByUsuarioIdUsuario(Long idUsuario);
    Optional<ProgresoTema> findByUsuarioIdUsuarioAndTemaIdTema(Long idUsuario, Integer idTema);
}
