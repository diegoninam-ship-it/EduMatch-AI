package com.edumatch.api.service;

import com.edumatch.api.dto.UsuarioResponse;
import com.edumatch.api.dto.UsuarioUpdateRequest;
import com.edumatch.api.entity.Usuario;
import com.edumatch.api.exception.ResourceNotFoundException;
import com.edumatch.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAll()
                .stream().map(UsuarioResponse::from).toList();
    }

    public UsuarioResponse obtener(Long id) {
        Usuario u = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + id));
        return UsuarioResponse.from(u);
    }

    public UsuarioResponse obtenerPorEmail(String email) {
        Usuario u = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + email));
        return UsuarioResponse.from(u);
    }

    public UsuarioResponse actualizar(Long id, UsuarioUpdateRequest request) {
        Usuario u = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + id));
        u.setNombre(request.getNombre());
        return UsuarioResponse.from(usuarioRepository.save(u));
    }

    public void desactivar(Long id) {
        Usuario u = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + id));
        u.setEstado(false);
        usuarioRepository.save(u);
    }
}
