package com.edumatch.api.controller;

import com.edumatch.api.entity.*;
import com.edumatch.api.service.TutorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tutores")
@RequiredArgsConstructor
public class TutorController {

    private final TutorService tutorService;

    @GetMapping
    public ResponseEntity<List<Tutor>> listar() {
        return ResponseEntity.ok(tutorService.listarDisponibles());
    }

    @GetMapping("/todos")
    public ResponseEntity<List<Tutor>> listarTodos() {
        return ResponseEntity.ok(tutorService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tutor> obtener(@PathVariable String id) {
        return ResponseEntity.ok(tutorService.obtener(id));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('TUTOR')")
    public ResponseEntity<Tutor> miPerfil(Authentication auth) {
        String userId = auth.getCredentials().toString();
        return ResponseEntity.ok(tutorService.obtenerPorUsuario(userId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TUTOR')")
    public ResponseEntity<Tutor> actualizarPerfil(@PathVariable String id,
                                                   @RequestBody Tutor datos) {
        return ResponseEntity.ok(tutorService.actualizarPerfil(id, datos));
    }

    @GetMapping("/{id}/materias")
    public ResponseEntity<List<TutorSubject>> listarMaterias(@PathVariable String id) {
        return ResponseEntity.ok(tutorService.listarMaterias(id));
    }

    @PostMapping("/{id}/materias/{subjectId}")
    @PreAuthorize("hasRole('TUTOR')")
    public ResponseEntity<TutorSubject> agregarMateria(@PathVariable String id,
                                                        @PathVariable String subjectId) {
        return ResponseEntity.ok(tutorService.agregarMateria(id, subjectId));
    }

    @DeleteMapping("/{id}/materias/{subjectId}")
    @PreAuthorize("hasRole('TUTOR')")
    public ResponseEntity<Void> quitarMateria(@PathVariable String id,
                                               @PathVariable String subjectId) {
        tutorService.quitarMateria(id, subjectId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/disponibilidad")
    public ResponseEntity<List<AvailabilitySlot>> listarDisponibilidad(@PathVariable String id) {
        return ResponseEntity.ok(tutorService.listarDisponibilidad(id));
    }

    @PostMapping("/{id}/disponibilidad")
    @PreAuthorize("hasRole('TUTOR')")
    public ResponseEntity<AvailabilitySlot> agregarDisponibilidad(@PathVariable String id,
                                                                   @RequestBody AvailabilitySlot slot) {
        return ResponseEntity.ok(tutorService.agregarDisponibilidad(id, slot));
    }

    @DeleteMapping("/disponibilidad/{slotId}")
    @PreAuthorize("hasRole('TUTOR')")
    public ResponseEntity<Void> eliminarDisponibilidad(@PathVariable String slotId) {
        tutorService.eliminarDisponibilidad(slotId);
        return ResponseEntity.noContent().build();
    }
}
