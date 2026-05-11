package com.edumatch.api.repository;

import com.edumatch.api.entity.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    List<Notificacion> findByUsuarioIdUsuarioOrderByFechaCreacionDesc(Long idUsuario);
    List<Notificacion> findByUsuarioIdUsuarioAndLeidaFalse(Long idUsuario);
}
