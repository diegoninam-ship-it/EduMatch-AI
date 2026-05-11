package com.edumatch.api.service;

import com.edumatch.api.dto.LogIAResponse;
import com.edumatch.api.entity.LogIA;
import com.edumatch.api.entity.Usuario;
import com.edumatch.api.exception.ResourceNotFoundException;
import com.edumatch.api.repository.LogIARepository;
import com.edumatch.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LogIAService {

    private final LogIARepository logIARepository;
    private final UsuarioRepository usuarioRepository;

    public List<LogIAResponse> listarPorUsuario(Long idUsuario) {
        return logIARepository.findByUsuarioIdUsuarioOrderByFechaDesc(idUsuario)
                .stream().map(LogIAResponse::from).toList();
    }

    public List<LogIAResponse> listarPorTipoEvento(String tipoEvento) {
        return logIARepository.findByTipoEvento(tipoEvento)
                .stream().map(LogIAResponse::from).toList();
    }

    public List<LogIAResponse> listarTodos() {
        return logIARepository.findAll()
                .stream().map(LogIAResponse::from).toList();
    }

    public LogIAResponse registrar(Long idUsuario, String tipoEvento, String descripcion) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + idUsuario));

        LogIA log = new LogIA();
        log.setUsuario(usuario);
        log.setTipoEvento(tipoEvento);
        log.setDescripcion(descripcion);
        return LogIAResponse.from(logIARepository.save(log));
    }
}
