package com.edumatch.api.repository;

import com.edumatch.api.entity.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PagoRepository extends JpaRepository<Pago, Long> {
    Optional<Pago> findBySesionIdSesion(Long idSesion);
    List<Pago> findByEstado(Pago.EstadoPago estado);
}
