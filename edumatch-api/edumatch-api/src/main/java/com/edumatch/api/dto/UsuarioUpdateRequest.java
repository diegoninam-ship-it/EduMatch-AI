package com.edumatch.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UsuarioUpdateRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
}
