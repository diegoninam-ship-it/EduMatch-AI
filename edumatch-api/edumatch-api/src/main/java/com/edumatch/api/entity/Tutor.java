package com.edumatch.api.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "tutores")
public class Tutor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tutor")
    private Long idTutor;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false, unique = true)
    private Usuario usuario;

    @Column(name = "precio_sesion")
    private Double precioSesion;

    @Column(name = "descripcion", length = 500)
    private String descripcion;

    @Column(name = "estado", nullable = false)
    private Boolean estado = true;

    @Column(name = "biografia", length = 500)
    private String biografia;

    @Column(name = "experiencia")
    private String experiencia;

    @Column(name = "foto_url")
    private String fotoUrl;

    @Column(name = "rating_promedio", nullable = false)
    private Double ratingPromedio = 0.0;

    @Column(name = "total_sesiones", nullable = false)
    private Integer totalSesiones = 0;

    @Column(name = "ubicacion", length = 100)
    private String ubicacion;

    @Column(name = "verificado", nullable = false)
    private Boolean verificado = false;
}
