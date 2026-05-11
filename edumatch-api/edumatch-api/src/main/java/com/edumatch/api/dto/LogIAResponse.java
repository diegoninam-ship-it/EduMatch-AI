package com.edumatch.api.dto;

import com.edumatch.api.entity.LogIA;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LogIAResponse {
    private Long idLog;
    private Long idUsuario;
    private String nombreUsuario;
    private String tipoEvento;
    private String descripcion;
    private LocalDateTime fecha;

    public static LogIAResponse from(LogIA l) {
        LogIAResponse r = new LogIAResponse();
        r.setIdLog(l.getIdLog());
        r.setIdUsuario(l.getUsuario().getIdUsuario());
        r.setNombreUsuario(l.getUsuario().getNombre());
        r.setTipoEvento(l.getTipoEvento());
        r.setDescripcion(l.getDescripcion());
        r.setFecha(l.getFecha());
        return r;
    }
}
