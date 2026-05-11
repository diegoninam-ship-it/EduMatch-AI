package com.edumatch.api.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "feedback_sesion")
public class FeedbackSesion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_feedback")
    private Long idFeedback;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sesion", nullable = false, unique = true)
    private Sesion sesion;

    @Column(name = "calificacion_cuantitativa")
    private Integer calificacionCuantitativa;

    @Column(name = "calificacion_cualitativa", length = 50)
    private String calificacionCualitativa;

    @Column(name = "comentario", columnDefinition = "TEXT")
    private String comentario;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    @PrePersist
    public void prePersist() {
        this.fechaRegistro = LocalDateTime.now();
    }
}
