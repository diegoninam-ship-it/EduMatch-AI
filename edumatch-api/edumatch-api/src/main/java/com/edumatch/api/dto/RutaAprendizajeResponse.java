package com.edumatch.api.dto;

import com.edumatch.api.entity.RutaAprendizaje;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RutaAprendizajeResponse {
    private Long idRuta;
    private Long idUsuario;
    private String nombreUsuario;
    private String estado;
    private LocalDateTime fechaCreacion;

    public static RutaAprendizajeResponse from(RutaAprendizaje r) {
        RutaAprendizajeResponse res = new RutaAprendizajeResponse();
        res.setIdRuta(r.getIdRuta());
        res.setIdUsuario(r.getUsuario().getIdUsuario());
        res.setNombreUsuario(r.getUsuario().getNombre());
        res.setEstado(r.getEstado().name());
        res.setFechaCreacion(r.getFechaCreacion());
        return res;
    }
}
