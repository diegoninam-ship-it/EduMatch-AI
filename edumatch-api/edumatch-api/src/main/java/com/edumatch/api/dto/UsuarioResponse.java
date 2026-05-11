package com.edumatch.api.dto;

import com.edumatch.api.entity.Usuario;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UsuarioResponse {
    private Long idUsuario;
    private String nombre;
    private String email;
    private String rol;
    private Boolean estado;
    private LocalDateTime fechaRegistro;

    public static UsuarioResponse from(Usuario u) {
        UsuarioResponse r = new UsuarioResponse();
        r.setIdUsuario(u.getIdUsuario());
        r.setNombre(u.getNombre());
        r.setEmail(u.getEmail());
        r.setRol(u.getRol().getNombre());
        r.setEstado(u.getEstado());
        r.setFechaRegistro(u.getFechaRegistro());
        return r;
    }
}
