package com.edumatch.api.dto;

import com.edumatch.api.entity.Materia;
import lombok.Data;

@Data
public class MateriaResponse {
    private Integer idMateria;
    private String nombre;
    private Boolean estado;

    public static MateriaResponse from(Materia m) {
        MateriaResponse r = new MateriaResponse();
        r.setIdMateria(m.getIdMateria());
        r.setNombre(m.getNombre());
        r.setEstado(m.getEstado());
        return r;
    }
}
