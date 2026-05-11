package com.edumatch.api.repository;

import com.edumatch.api.entity.Sesion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SesionRepository extends JpaRepository<Sesion, Long> {
    List<Sesion> findByEstudianteIdUsuario(Long idEstudiante);
    List<Sesion> findByTutorIdTutor(Long idTutor);
    List<Sesion> findByEstudianteIdUsuarioAndEstado(Long idEstudiante, Sesion.EstadoSesion estado);
    List<Sesion> findByTutorIdTutorAndEstado(Long idTutor, Sesion.EstadoSesion estado);
}
