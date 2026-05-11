package com.edumatch.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ModuloRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotNull(message = "El orden es obligatorio")
    private Integer orden;

    @NotNull(message = "El id de materia es obligatorio")
    private Integer idMateria;
}
