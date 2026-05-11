package com.edumatch.api.controller;

import com.edumatch.api.dto.*;
import com.edumatch.api.service.SesionService;
import com.edumatch.api.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sesiones")
@RequiredArgsConstructor
public class SesionController {

    private final SesionService sesionService;
    private final UsuarioService usuarioService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SesionResponse>> listarTodas() {
        return ResponseEntity.ok(sesionService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SesionResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(sesionService.obtener(id));
    }

    @GetMapping("/estudiante/{idEstudiante}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ESTUDIANTE')")
    public ResponseEntity<List<SesionResponse>> listarPorEstudiante(@PathVariable Long idEstudiante) {
        return ResponseEntity.ok(sesionService.listarPorEstudiante(idEstudiante));
    }

    @GetMapping("/tutor/{idTutor}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TUTOR')")
    public ResponseEntity<List<SesionResponse>> listarPorTutor(@PathVariable Long idTutor) {
        return ResponseEntity.ok(sesionService.listarPorTutor(idTutor));
    }

    @GetMapping("/mis-sesiones")
    public ResponseEntity<List<SesionResponse>> misSesiones(Authentication authentication) {
        UsuarioResponse me = usuarioService.obtenerPorEmail(authentication.getName());
        if (me.getRol().equals("TUTOR")) {
            // buscar tutor por usuario y delegar
            return ResponseEntity.ok(sesionService.listarPorTutor(me.getIdUsuario()));
        }
        return ResponseEntity.ok(sesionService.listarPorEstudiante(me.getIdUsuario()));
    }

    @PostMapping
    public ResponseEntity<SesionResponse> crear(@Valid @RequestBody SesionRequest request) {
        return ResponseEntity.ok(sesionService.crear(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SesionResponse> actualizar(@PathVariable Long id,
                                                      @RequestBody SesionRequest request) {
        return ResponseEntity.ok(sesionService.actualizar(id, request));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<SesionResponse> cambiarEstado(@PathVariable Long id,
                                                         @RequestParam String estado) {
        return ResponseEntity.ok(sesionService.cambiarEstado(id, estado));
    }

    // --- Feedback ---

    @PostMapping("/feedback")
    public ResponseEntity<FeedbackResponse> crearFeedback(@Valid @RequestBody FeedbackRequest request) {
        return ResponseEntity.ok(sesionService.crearFeedback(request));
    }

    @GetMapping("/{id}/feedback")
    public ResponseEntity<FeedbackResponse> obtenerFeedback(@PathVariable Long id) {
        return ResponseEntity.ok(sesionService.obtenerFeedbackPorSesion(id));
    }
}
