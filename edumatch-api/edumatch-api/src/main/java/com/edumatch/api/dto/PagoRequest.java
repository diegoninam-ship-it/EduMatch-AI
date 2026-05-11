package com.edumatch.api.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PagoRequest {

    @NotNull
    private Long idSesion;

    @NotNull
    private Double monto;
}
