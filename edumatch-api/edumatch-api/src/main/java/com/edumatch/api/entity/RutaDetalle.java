package com.edumatch.api.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "ruta_detalle")
public class RutaDetalle {

    public enum EstadoDetalle { PENDIENTE, EN_PROGRESO, COMPLETADO }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle")
    private Long idDetalle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ruta", nullable = false)
    private RutaAprendizaje ruta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tema", nullable = false)
    private Tema tema;

    @Column(name = "orden", nullable = false)
    private Integer orden = 1;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoDetalle estado = EstadoDetalle.PENDIENTE;
}
