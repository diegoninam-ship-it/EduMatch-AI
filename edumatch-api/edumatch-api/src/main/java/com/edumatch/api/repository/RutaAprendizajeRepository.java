package com.edumatch.api.repository;

import com.edumatch.api.entity.RutaAprendizaje;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RutaAprendizajeRepository extends JpaRepository<RutaAprendizaje, Long> {
    List<RutaAprendizaje> findByUsuarioIdUsuario(Long idUsuario);
    Optional<RutaAprendizaje> findByUsuarioIdUsuarioAndEstado(Long idUsuario, RutaAprendizaje.EstadoRuta estado);
}
