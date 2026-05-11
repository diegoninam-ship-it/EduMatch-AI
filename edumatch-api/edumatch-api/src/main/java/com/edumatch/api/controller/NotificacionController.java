package com.edumatch.api.controller;

import com.edumatch.api.dto.NotificacionRequest;
import com.edumatch.api.dto.NotificacionResponse;
import com.edumatch.api.dto.UsuarioResponse;
import com.edumatch.api.service.NotificacionService;
import com.edumatch.api.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
@RequiredArgsConstructor
public class NotificacionController {

    private final NotificacionService notificacionService;
    private final UsuarioService usuarioService;

    @GetMapping("/me")
    public ResponseEntity<List<NotificacionResponse>> misNotificaciones(Authentication authentication) {
        UsuarioResponse me = usuarioService.obtenerPorEmail(authentication.getName());
        return ResponseEntity.ok(notificacionService.listarPorUsuario(me.getIdUsuario()));
    }

    @GetMapping("/me/no-leidas")
    public ResponseEntity<List<NotificacionResponse>> misNoLeidas(Authentication authentication) {
        UsuarioResponse me = usuarioService.obtenerPorEmail(authentication.getName());
        return ResponseEntity.ok(notificacionService.listarNoLeidas(me.getIdUsuario()));
    }

    @GetMapping("/usuario/{idUsuario}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<NotificacionResponse>> listarPorUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(notificacionService.listarPorUsuario(idUsuario));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NotificacionResponse> crear(@Valid @RequestBody NotificacionRequest request) {
        return ResponseEntity.ok(notificacionService.crear(request));
    }

    @PatchMapping("/{id}/leer")
    public ResponseEntity<NotificacionResponse> marcarLeida(@PathVariable Long id) {
        return ResponseEntity.ok(notificacionService.marcarLeida(id));
    }

    @PatchMapping("/me/leer-todas")
    public ResponseEntity<Void> marcarTodasLeidas(Authentication authentication) {
        UsuarioResponse me = usuarioService.obtenerPorEmail(authentication.getName());
        notificacionService.marcarTodasLeidas(me.getIdUsuario());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        notificacionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
