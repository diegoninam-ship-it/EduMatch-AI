package com.edumatch.api.controller;

import com.edumatch.api.dto.UsuarioResponse;
import com.edumatch.api.dto.UsuarioUpdateRequest;
import com.edumatch.api.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioResponse>> listar() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.obtener(id));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> perfil(Authentication authentication) {
        return ResponseEntity.ok(usuarioService.obtenerPorEmail(authentication.getName()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioResponse> actualizar(@PathVariable Long id,
                                                       @Valid @RequestBody UsuarioUpdateRequest request) {
        return ResponseEntity.ok(usuarioService.actualizar(id, request));
    }

    @PutMapping("/me")
    public ResponseEntity<UsuarioResponse> actualizarPerfil(Authentication authentication,
                                                              @Valid @RequestBody UsuarioUpdateRequest request) {
        UsuarioResponse me = usuarioService.obtenerPorEmail(authentication.getName());
        return ResponseEntity.ok(usuarioService.actualizar(me.getIdUsuario(), request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {
        usuarioService.desactivar(id);
        return ResponseEntity.noContent().build();
    }
}
