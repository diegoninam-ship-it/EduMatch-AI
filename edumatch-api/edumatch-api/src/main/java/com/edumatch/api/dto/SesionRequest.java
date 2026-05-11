package com.edumatch.api.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class SesionRequest {

    @NotNull(message = "El id del estudiante es obligatorio")
    private Long idEstudiante;

    @NotNull(message = "El id del tutor es obligatorio")
    private Long idTutor;

    @NotNull(message = "El id de la materia es obligatorio")
    private Integer idMateria;

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;

    @NotNull(message = "La hora de inicio es obligatoria")
    private LocalTime horaInicio;

    @NotNull(message = "La hora de fin es obligatoria")
    private LocalTime horaFin;

    private String enlaceReunion;
    private String plataforma;
    private String notas;
}
