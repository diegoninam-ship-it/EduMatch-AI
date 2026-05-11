package com.edumatch.api.dto;

import com.edumatch.api.entity.RutaDetalle;
import lombok.Data;

@Data
public class RutaDetalleResponse {
    private Long idDetalle;
    private Long idRuta;
    private Integer idTema;
    private String nombreTema;
    private String nivelDificultad;
    private Integer orden;
    private String estado;

    public static RutaDetalleResponse from(RutaDetalle d) {
        RutaDetalleResponse r = new RutaDetalleResponse();
        r.setIdDetalle(d.getIdDetalle());
        r.setIdRuta(d.getRuta().getIdRuta());
        r.setIdTema(d.getTema().getIdTema());
        r.setNombreTema(d.getTema().getNombre());
        r.setNivelDificultad(d.getTema().getNivelDificultad().name());
        r.setOrden(d.getOrden());
        r.setEstado(d.getEstado().name());
        return r;
    }
}
