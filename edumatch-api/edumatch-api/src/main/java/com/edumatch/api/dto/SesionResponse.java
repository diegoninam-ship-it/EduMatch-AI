package com.edumatch.api.dto;

import com.edumatch.api.entity.Sesion;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class SesionResponse {
    private Long idSesion;
    private Long idEstudiante;
    private String nombreEstudiante;
    private Long idTutor;
    private String nombreTutor;
    private Integer idMateria;
    private String nombreMateria;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private String estado;
    private String enlaceReunion;
    private String plataforma;
    private String notas;

    public static SesionResponse from(Sesion s) {
        SesionResponse r = new SesionResponse();
        r.setIdSesion(s.getIdSesion());
        r.setIdEstudiante(s.getEstudiante().getIdUsuario());
        r.setNombreEstudiante(s.getEstudiante().getNombre());
        r.setIdTutor(s.getTutor().getIdTutor());
        r.setNombreTutor(s.getTutor().getUsuario().getNombre());
        r.setIdMateria(s.getMateria().getIdMateria());
        r.setNombreMateria(s.getMateria().getNombre());
        r.setFecha(s.getFecha());
        r.setHoraInicio(s.getHoraInicio());
        r.setHoraFin(s.getHoraFin());
        r.setEstado(s.getEstado().name());
        r.setEnlaceReunion(s.getEnlaceReunion());
        r.setPlataforma(s.getPlataforma());
        r.setNotas(s.getNotas());
        return r;
    }
}
