package com.edumatch.api.dto;

import com.edumatch.api.entity.Pago;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PagoResponse {
    private Long idPago;
    private Long idSesion;
    private Double monto;
    private String estado;
    private LocalDateTime fechaPago;

    public static PagoResponse from(Pago p) {
        PagoResponse r = new PagoResponse();
        r.setIdPago(p.getIdPago());
        r.setIdSesion(p.getSesion().getIdSesion());
        r.setMonto(p.getMonto());
        r.setEstado(p.getEstado().name());
        r.setFechaPago(p.getFechaPago());
        return r;
    }
}
