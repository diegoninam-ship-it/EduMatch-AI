package com.edumatch.api.dto;

import com.edumatch.api.entity.Notificacion;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificacionResponse {
    private Long idNotificacion;
    private Long idUsuario;
    private String titulo;
    private String mensaje;
    private String tipo;
    private Boolean leida;
    private LocalDateTime fechaCreacion;

    public static NotificacionResponse from(Notificacion n) {
        NotificacionResponse r = new NotificacionResponse();
        r.setIdNotificacion(n.getIdNotificacion());
        r.setIdUsuario(n.getUsuario().getIdUsuario());
        r.setTitulo(n.getTitulo());
        r.setMensaje(n.getMensaje());
        r.setTipo(n.getTipo());
        r.setLeida(n.getLeida());
        r.setFechaCreacion(n.getFechaCreacion());
        return r;
    }
}
