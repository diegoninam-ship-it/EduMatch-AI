package com.edumatch.api.controller;

import com.edumatch.api.dto.*;
import com.edumatch.api.service.MateriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materias")
@RequiredArgsConstructor
public class MateriaController {

    private final MateriaService materiaService;

    @GetMapping
    public ResponseEntity<List<MateriaResponse>> listar() {
        return ResponseEntity.ok(materiaService.listarActivas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MateriaResponse> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(materiaService.obtener(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MateriaResponse> crear(@Valid @RequestBody MateriaRequest request) {
        return ResponseEntity.ok(materiaService.crear(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MateriaResponse> actualizar(@PathVariable Integer id,
                                                       @Valid @RequestBody MateriaRequest request) {
        return ResponseEntity.ok(materiaService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> desactivar(@PathVariable Integer id) {
        materiaService.desactivar(id);
        return ResponseEntity.noContent().build();
    }

    // --- Módulos ---

    @GetMapping("/{id}/modulos")
    public ResponseEntity<List<ModuloResponse>> listarModulos(@PathVariable Integer id) {
        return ResponseEntity.ok(materiaService.listarModulos(id));
    }

    @PostMapping("/modulos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ModuloResponse> crearModulo(@Valid @RequestBody ModuloRequest request) {
        return ResponseEntity.ok(materiaService.crearModulo(request));
    }

    // --- Temas ---

    @GetMapping("/modulos/{idModulo}/temas")
    public ResponseEntity<List<TemaResponse>> listarTemas(@PathVariable Integer idModulo) {
        return ResponseEntity.ok(materiaService.listarTemas(idModulo));
    }

    @PostMapping("/temas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TemaResponse> crearTema(@Valid @RequestBody TemaRequest request) {
        return ResponseEntity.ok(materiaService.crearTema(request));
    }
}
