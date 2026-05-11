package com.edumatch.api.controller;

import com.edumatch.api.entity.*;
import com.edumatch.api.service.RutaAprendizajeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rutas")
@RequiredArgsConstructor
public class RutaAprendizajeController {

    private final RutaAprendizajeService rutaService;

    @GetMapping("/mis-rutas")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<LearningRoute>> misRutas(Authentication auth) {
        String userId = auth.getCredentials().toString();
        return ResponseEntity.ok(rutaService.listarPorEstudiante(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningRoute> obtener(@PathVariable String id) {
        return ResponseEntity.ok(rutaService.obtener(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<LearningRoute> crear(@RequestBody LearningRoute route) {
        return ResponseEntity.ok(rutaService.crear(route));
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<LearningRoute> cambiarEstado(@PathVariable String id,
                                                        @RequestParam String estado) {
        return ResponseEntity.ok(rutaService.cambiarEstado(id, estado));
    }

    @GetMapping("/{id}/topicos")
    public ResponseEntity<List<LearningRouteTopic>> listarTopicos(@PathVariable String id) {
        return ResponseEntity.ok(rutaService.listarTopicos(id));
    }

    @GetMapping("/progreso/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<StudentProgress>> miProgreso(Authentication auth) {
        String userId = auth.getCredentials().toString();
        return ResponseEntity.ok(rutaService.listarProgreso(userId));
    }

    @PostMapping("/progreso")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentProgress> registrarProgreso(@RequestBody StudentProgress progress) {
        return ResponseEntity.ok(rutaService.registrarProgreso(progress));
    }

    @GetMapping("/perfil/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentProfile> miPerfil(Authentication auth) {
        String userId = auth.getCredentials().toString();
        return ResponseEntity.ok(rutaService.obtenerPerfil(userId));
    }

    @PutMapping("/perfil")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentProfile> guardarPerfil(@RequestBody StudentProfile profile) {
        return ResponseEntity.ok(rutaService.guardarPerfil(profile));
    }
}
