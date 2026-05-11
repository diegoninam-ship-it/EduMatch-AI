package com.edumatch.api.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "materias")
public class Materia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_materia")
    private Integer idMateria;

    @Column(name = "nombre", nullable = false, length = 150)
    private String nombre;

    @Column(name = "estado", nullable = false)
    private Boolean estado = true;
}
