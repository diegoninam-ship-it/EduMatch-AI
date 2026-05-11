package com.edumatch.api.controller;

import com.edumatch.api.dto.LogIAResponse;
import com.edumatch.api.dto.UsuarioResponse;
import com.edumatch.api.service.LogIAService;
import com.edumatch.api.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs-ia")
@RequiredArgsConstructor
public class LogIAController {

    private final LogIAService logIAService;
    private final UsuarioService usuarioService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LogIAResponse>> listarTodos() {
        return ResponseEntity.ok(logIAService.listarTodos());
    }

    @GetMapping("/tipo/{tipoEvento}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LogIAResponse>> listarPorTipo(@PathVariable String tipoEvento) {
        return ResponseEntity.ok(logIAService.listarPorTipoEvento(tipoEvento));
    }

    @GetMapping("/me")
    public ResponseEntity<List<LogIAResponse>> misLogs(Authentication authentication) {
        UsuarioResponse me = usuarioService.obtenerPorEmail(authentication.getName());
        return ResponseEntity.ok(logIAService.listarPorUsuario(me.getIdUsuario()));
    }

    @GetMapping("/usuario/{idUsuario}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LogIAResponse>> listarPorUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(logIAService.listarPorUsuario(idUsuario));
    }

    @PostMapping("/registrar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LogIAResponse> registrar(@RequestParam Long idUsuario,
                                                    @RequestParam String tipoEvento,
                                                    @RequestParam(required = false) String descripcion) {
        return ResponseEntity.ok(logIAService.registrar(idUsuario, tipoEvento, descripcion));
    }
}
