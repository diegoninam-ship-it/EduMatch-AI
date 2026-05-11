package com.edumatch.api.service;

import com.edumatch.api.dto.NotificacionRequest;
import com.edumatch.api.dto.NotificacionResponse;
import com.edumatch.api.entity.Notificacion;
import com.edumatch.api.entity.Usuario;
import com.edumatch.api.exception.ResourceNotFoundException;
import com.edumatch.api.repository.NotificacionRepository;
import com.edumatch.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final UsuarioRepository usuarioRepository;

    public List<NotificacionResponse> listarPorUsuario(Long idUsuario) {
        return notificacionRepository.findByUsuarioIdUsuarioOrderByFechaCreacionDesc(idUsuario)
                .stream().map(NotificacionResponse::from).toList();
    }

    public List<NotificacionResponse> listarNoLeidas(Long idUsuario) {
        return notificacionRepository.findByUsuarioIdUsuarioAndLeidaFalse(idUsuario)
                .stream().map(NotificacionResponse::from).toList();
    }

    public NotificacionResponse crear(NotificacionRequest request) {
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + request.getIdUsuario()));

        Notificacion n = new Notificacion();
        n.setUsuario(usuario);
        n.setTitulo(request.getTitulo());
        n.setMensaje(request.getMensaje());
        n.setTipo(request.getTipo());
        n.setLeida(false);
        return NotificacionResponse.from(notificacionRepository.save(n));
    }

    public NotificacionResponse marcarLeida(Long id) {
        Notificacion n = notificacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notificación no encontrada: " + id));
        n.setLeida(true);
        return NotificacionResponse.from(notificacionRepository.save(n));
    }

    public void marcarTodasLeidas(Long idUsuario) {
        List<Notificacion> noLeidas = notificacionRepository.findByUsuarioIdUsuarioAndLeidaFalse(idUsuario);
        noLeidas.forEach(n -> n.setLeida(true));
        notificacionRepository.saveAll(noLeidas);
    }

    public void eliminar(Long id) {
        notificacionRepository.deleteById(id);
    }
}
