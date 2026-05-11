package com.edumatch.api.dto;

import lombok.Data;

@Data
public class TutorRequest {
    private Double precioSesion;
    private String descripcion;
    private String biografia;
    private String experiencia;
    private String fotoUrl;
    private String ubicacion;
}
