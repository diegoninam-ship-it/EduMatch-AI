package com.edumatch.api.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "temas")
public class Tema {

    public enum NivelDificultad { BASICO, INTERMEDIO, AVANZADO }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tema")
    private Integer idTema;

    @Column(name = "nombre", nullable = false, length = 150)
    private String nombre;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(name = "nivel_dificultad", nullable = false)
    private NivelDificultad nivelDificultad = NivelDificultad.BASICO;

    @Column(name = "orden", nullable = false)
    private Integer orden = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_modulo", nullable = false)
    private Modulo modulo;
}
