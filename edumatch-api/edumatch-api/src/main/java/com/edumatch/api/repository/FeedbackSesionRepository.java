package com.edumatch.api.repository;

import com.edumatch.api.entity.FeedbackSesion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface FeedbackSesionRepository extends JpaRepository<FeedbackSesion, Long> {
    Optional<FeedbackSesion> findBySesionIdSesion(Long idSesion);

    @Query("SELECT AVG(f.calificacionCuantitativa) FROM FeedbackSesion f WHERE f.sesion.tutor.idTutor = :idTutor")
    Double calcularRatingPromedioPorTutor(Long idTutor);
}
