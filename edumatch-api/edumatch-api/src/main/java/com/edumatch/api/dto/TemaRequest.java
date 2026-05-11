package com.edumatch.api.dto;

import com.edumatch.api.entity.Tema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TemaRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    private String descripcion;

    private Tema.NivelDificultad nivelDificultad;

    @NotNull(message = "El orden es obligatorio")
    private Integer orden;

    @NotNull(message = "El id de módulo es obligatorio")
    private Integer idModulo;
}
