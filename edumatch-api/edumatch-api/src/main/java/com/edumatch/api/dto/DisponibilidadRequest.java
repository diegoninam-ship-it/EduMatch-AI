package com.edumatch.api.dto;

import com.edumatch.api.entity.DisponibilidadTutor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalTime;

@Data
public class DisponibilidadRequest {

    @NotBlank(message = "El día de la semana es obligatorio")
    private String diaSemana;

    @NotNull(message = "La hora de inicio es obligatoria")
    private LocalTime horaInicio;

    @NotNull(message = "La hora de fin es obligatoria")
    private LocalTime horaFin;

    private DisponibilidadTutor.EstadoDisponibilidad estado;
}
