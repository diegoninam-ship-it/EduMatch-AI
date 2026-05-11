package com.edumatch.api.dto;

import com.edumatch.api.entity.Modulo;
import lombok.Data;

@Data
public class ModuloResponse {
    private Integer idModulo;
    private String nombre;
    private Integer orden;
    private Integer idMateria;
    private String nombreMateria;

    public static ModuloResponse from(Modulo m) {
        ModuloResponse r = new ModuloResponse();
        r.setIdModulo(m.getIdModulo());
        r.setNombre(m.getNombre());
        r.setOrden(m.getOrden());
        r.setIdMateria(m.getMateria().getIdMateria());
        r.setNombreMateria(m.getMateria().getNombre());
        return r;
    }
}
