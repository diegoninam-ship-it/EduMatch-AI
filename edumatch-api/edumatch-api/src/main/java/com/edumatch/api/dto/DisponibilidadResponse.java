package com.edumatch.api.dto;

import com.edumatch.api.entity.DisponibilidadTutor;
import lombok.Data;

import java.time.LocalTime;

@Data
public class DisponibilidadResponse {
    private Long idDisponibilidad;
    private Long idTutor;
    private String diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private String estado;

    public static DisponibilidadResponse from(DisponibilidadTutor d) {
        DisponibilidadResponse r = new DisponibilidadResponse();
        r.setIdDisponibilidad(d.getIdDisponibilidad());
        r.setIdTutor(d.getTutor().getIdTutor());
        r.setDiaSemana(d.getDiaSemana());
        r.setHoraInicio(d.getHoraInicio());
        r.setHoraFin(d.getHoraFin());
        r.setEstado(d.getEstado().name());
        return r;
    }
}
