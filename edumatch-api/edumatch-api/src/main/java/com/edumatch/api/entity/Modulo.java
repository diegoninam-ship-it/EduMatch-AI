package com.edumatch.api.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "modulos")
public class Modulo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_modulo")
    private Integer idModulo;

    @Column(name = "nombre", nullable = false, length = 150)
    private String nombre;

    @Column(name = "orden", nullable = false)
    private Integer orden = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_materia", nullable = false)
    private Materia materia;
}
