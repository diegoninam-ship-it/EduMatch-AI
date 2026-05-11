package com.edumatch.api.dto;

import com.edumatch.api.entity.ProgresoTema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProgresoTemaRequest {

    @NotNull
    private Long idUsuario;

    @NotNull
    private Integer idTema;

    private ProgresoTema.EstadoProgreso estado;

    @Min(0) @Max(100)
    private Integer porcentajeAvance;
}
