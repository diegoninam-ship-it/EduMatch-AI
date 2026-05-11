package com.edumatch.api.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "pagos")
public class Pago {

    public enum EstadoPago { PENDIENTE, PAGADO, FALLIDO }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pago")
    private Long idPago;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sesion", nullable = false)
    private Sesion sesion;

    @Column(name = "monto", nullable = false)
    private Double monto;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoPago estado = EstadoPago.PENDIENTE;

    @Column(name = "fecha_pago")
    private LocalDateTime fechaPago;
}
