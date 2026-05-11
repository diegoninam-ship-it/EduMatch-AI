package com.edumatch.api.repository;

import com.edumatch.api.entity.PerfilEstudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PerfilEstudianteRepository extends JpaRepository<PerfilEstudiante, Long> {
    Optional<PerfilEstudiante> findByUsuarioIdUsuario(Long idUsuario);
}
