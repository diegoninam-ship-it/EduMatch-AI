package com.edumatch.api.repository;

import com.edumatch.api.entity.RutaDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RutaDetalleRepository extends JpaRepository<RutaDetalle, Long> {
    List<RutaDetalle> findByRutaIdRutaOrderByOrdenAsc(Long idRuta);
    List<RutaDetalle> findByRutaIdRutaAndEstado(Long idRuta, RutaDetalle.EstadoDetalle estado);
}
