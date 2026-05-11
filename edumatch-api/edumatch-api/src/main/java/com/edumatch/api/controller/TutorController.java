package com.edumatch.api.controller;

import com.edumatch.api.dto.*;
import com.edumatch.api.service.TutorService;
import com.edumatch.api.service.UsuarioService;
import jakarta.validation.Valid;
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
    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<TutorResponse>> listar() {
        return ResponseEntity.ok(tutorService.listarActivos());
    }

    @GetMapping("/verificados")
    public ResponseEntity<List<TutorResponse>> listarVerificados() {
        return ResponseEntity.ok(tutorService.listarVerificados());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TutorResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(tutorService.obtener(id));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('TUTOR')")
    public ResponseEntity<TutorResponse> miPerfil(Authentication authentication) {
        UsuarioResponse me = usuarioService.obtenerPorEmail(authentication.getName());
        return ResponseEntity.ok(tutorService.obtenerPorUsuario(me.getIdUsuario()));
    }

    @PostMapping("/usuario/{idUsuario}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TutorResponse> crear(@PathVariable Long idUsuario,
                                                @RequestBody TutorRequest request) {
        return ResponseEntity.ok(tutorService.crear(idUsuario, request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TUTOR')")
    public ResponseEntity<TutorResponse> actualizar(@PathVariable Long id,
                                                     @RequestBody TutorRequest request) {
        return ResponseEntity.ok(tutorService.actualizar(id, request));
    }

    @PutMapping("/{id}/verificar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TutorResponse> verificar(@PathVariable Long id) {
        return ResponseEntity.ok(tutorService.verificar(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {
        tutorService.desactivar(id);
        return ResponseEntity.noContent().build();
    }

    // --- Materias ---

    @GetMapping("/{id}/materias")
    public ResponseEntity<List<MateriaResponse>> listarMaterias(@PathVariable Long id) {
        return ResponseEntity.ok(tutorService.listarMaterias(id));
    }

    @PostMapping("/{id}/materias/{idMateria}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TUTOR')")
    public ResponseEntity<Void> agregarMateria(@PathVariable Long id,
                                                @PathVariable Integer idMateria) {
        tutorService.agregarMateria(id, idMateria);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/materias/{idMateria}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TUTOR')")
    public ResponseEntity<Void> quitarMateria(@PathVariable Long id,
                                               @PathVariable Integer idMateria) {
        tutorService.quitarMateria(id, idMateria);
        return ResponseEntity.noContent().build();
    }

    // --- Disponibilidad ---

    @GetMapping("/{id}/disponibilidad")
    public ResponseEntity<List<DisponibilidadResponse>> listarDisponibilidad(@PathVariable Long id) {
        return ResponseEntity.ok(tutorService.listarDisponibilidad(id));
    }

    @PostMapping("/{id}/disponibilidad")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TUTOR')")
    public ResponseEntity<DisponibilidadResponse> agregarDisponibilidad(@PathVariable Long id,
                                                                         @Valid @RequestBody DisponibilidadRequest request) {
        return ResponseEntity.ok(tutorService.agregarDisponibilidad(id, request));
    }

    @DeleteMapping("/disponibilidad/{idDisponibilidad}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TUTOR')")
    public ResponseEntity<Void> eliminarDisponibilidad(@PathVariable Long idDisponibilidad) {
        tutorService.eliminarDisponibilidad(idDisponibilidad);
        return ResponseEntity.noContent().build();
    }
}
