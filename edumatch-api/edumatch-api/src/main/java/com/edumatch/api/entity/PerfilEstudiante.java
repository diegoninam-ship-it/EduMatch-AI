package com.edumatch.api.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "perfil_estudiante")
public class PerfilEstudiante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_perfil")
    private Long idPerfil;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false, unique = true)
    private Usuario usuario;

    @Column(name = "nivel", length = 50)
    private String nivel;

    @Column(name = "objetivos", length = 500)
    private String objetivos;

    @Column(name = "horario_preferido", length = 100)
    private String horarioPreferido;

    @Column(name = "horas_disponibles", length = 50)
    private String horasDisponibles;

    @Column(name = "foto_url")
    private String fotoUrl;

    @Column(name = "ubicacion", length = 100)
    private String ubicacion;
}
