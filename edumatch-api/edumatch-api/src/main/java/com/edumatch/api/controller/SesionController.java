package com.edumatch.api.controller;

import com.edumatch.api.entity.Session;
import com.edumatch.api.service.SesionService;
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

    @GetMapping("/mis-sesiones")
    public ResponseEntity<List<Session>> misSesiones(Authentication auth) {
        String userId = auth.getCredentials().toString();
        String role = auth.getAuthorities().iterator().next().getAuthority();
        if (role.contains("TUTOR")) {
            return ResponseEntity.ok(sesionService.listarPorTutor(userId));
        }
        return ResponseEntity.ok(sesionService.listarPorEstudiante(userId));
    }

    @GetMapping("/estudiante/{studentId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Session>> listarPorEstudiante(@PathVariable String studentId) {
        return ResponseEntity.ok(sesionService.listarPorEstudiante(studentId));
    }

    @GetMapping("/tutor/{tutorId}")
    @PreAuthorize("hasRole('TUTOR')")
    public ResponseEntity<List<Session>> listarPorTutor(@PathVariable String tutorId) {
        return ResponseEntity.ok(sesionService.listarPorTutor(tutorId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Session> obtener(@PathVariable String id) {
        return ResponseEntity.ok(sesionService.obtener(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Session> crear(@RequestBody Session request) {
        return ResponseEntity.ok(sesionService.crear(request));
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('TUTOR') or hasRole('STUDENT')")
    public ResponseEntity<Session> cambiarEstado(@PathVariable String id,
                                                  @RequestParam String estado) {
        return ResponseEntity.ok(sesionService.cambiarEstado(id, estado));
    }
}
