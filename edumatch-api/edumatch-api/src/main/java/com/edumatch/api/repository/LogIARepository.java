package com.edumatch.api.repository;

import com.edumatch.api.entity.LogIA;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LogIARepository extends JpaRepository<LogIA, Long> {
    List<LogIA> findByUsuarioIdUsuarioOrderByFechaDesc(Long idUsuario);
    List<LogIA> findByTipoEvento(String tipoEvento);
}
