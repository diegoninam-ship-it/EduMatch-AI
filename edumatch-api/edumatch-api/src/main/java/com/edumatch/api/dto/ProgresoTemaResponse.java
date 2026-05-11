package com.edumatch.api.dto;

import com.edumatch.api.entity.ProgresoTema;
import lombok.Data;

@Data
public class ProgresoTemaResponse {
    private Long idProgreso;
    private Long idUsuario;
    private Integer idTema;
    private String nombreTema;
    private String estado;
    private Integer porcentajeAvance;

    public static ProgresoTemaResponse from(ProgresoTema p) {
        ProgresoTemaResponse r = new ProgresoTemaResponse();
        r.setIdProgreso(p.getIdProgreso());
        r.setIdUsuario(p.getUsuario().getIdUsuario());
        r.setIdTema(p.getTema().getIdTema());
        r.setNombreTema(p.getTema().getNombre());
        r.setEstado(p.getEstado().name());
        r.setPorcentajeAvance(p.getPorcentajeAvance());
        return r;
    }
}
