package com.edumatch.api.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "progreso_tema",
        uniqueConstraints = @UniqueConstraint(columnNames = {"id_usuario", "id_tema"}))
public class ProgresoTema {

    public enum EstadoProgreso { PENDIENTE, EN_PROGRESO, COMPLETADO }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_progreso")
    private Long idProgreso;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tema", nullable = false)
    private Tema tema;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoProgreso estado = EstadoProgreso.PENDIENTE;

    @Column(name = "porcentaje_avance", nullable = false)
    private Integer porcentajeAvance = 0;
}
