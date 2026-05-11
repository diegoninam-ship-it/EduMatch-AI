package com.edumatch.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long idUsuario;
    private String nombre;
    private String email;
    private String rol;
}
