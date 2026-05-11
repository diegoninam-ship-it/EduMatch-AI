package com.edumatch.api.dto;

import com.edumatch.api.entity.Tema;
import lombok.Data;

@Data
public class TemaResponse {
    private Integer idTema;
    private String nombre;
    private String descripcion;
    private String nivelDificultad;
    private Integer orden;
    private Integer idModulo;
    private String nombreModulo;

    public static TemaResponse from(Tema t) {
        TemaResponse r = new TemaResponse();
        r.setIdTema(t.getIdTema());
        r.setNombre(t.getNombre());
        r.setDescripcion(t.getDescripcion());
        r.setNivelDificultad(t.getNivelDificultad().name());
        r.setOrden(t.getOrden());
        r.setIdModulo(t.getModulo().getIdModulo());
        r.setNombreModulo(t.getModulo().getNombre());
        return r;
    }
}
