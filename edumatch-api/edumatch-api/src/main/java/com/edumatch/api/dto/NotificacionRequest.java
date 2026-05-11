package com.edumatch.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NotificacionRequest {

    @NotNull
    private Long idUsuario;

    @NotBlank
    private String titulo;

    private String mensaje;
    private String tipo;
}
