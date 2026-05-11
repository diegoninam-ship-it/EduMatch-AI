package com.edumatch.api.dto;

import com.edumatch.api.entity.Tutor;
import lombok.Data;

@Data
public class TutorResponse {
    private Long idTutor;
    private Long idUsuario;
    private String nombre;
    private String email;
    private Double precioSesion;
    private String descripcion;
    private String biografia;
    private String experiencia;
    private String fotoUrl;
    private Double ratingPromedio;
    private Integer totalSesiones;
    private String ubicacion;
    private Boolean verificado;
    private Boolean estado;

    public static TutorResponse from(Tutor t) {
        TutorResponse r = new TutorResponse();
        r.setIdTutor(t.getIdTutor());
        r.setIdUsuario(t.getUsuario().getIdUsuario());
        r.setNombre(t.getUsuario().getNombre());
        r.setEmail(t.getUsuario().getEmail());
        r.setPrecioSesion(t.getPrecioSesion());
        r.setDescripcion(t.getDescripcion());
        r.setBiografia(t.getBiografia());
        r.setExperiencia(t.getExperiencia());
        r.setFotoUrl(t.getFotoUrl());
        r.setRatingPromedio(t.getRatingPromedio());
        r.setTotalSesiones(t.getTotalSesiones());
        r.setUbicacion(t.getUbicacion());
        r.setVerificado(t.getVerificado());
        r.setEstado(t.getEstado());
        return r;
    }
}
