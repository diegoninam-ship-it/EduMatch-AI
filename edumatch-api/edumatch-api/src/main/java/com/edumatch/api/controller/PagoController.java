package com.edumatch.api.controller;

import com.edumatch.api.dto.PagoRequest;
import com.edumatch.api.dto.PagoResponse;
import com.edumatch.api.service.PagoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pagos")
@RequiredArgsConstructor
public class PagoController {

    private final PagoService pagoService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PagoResponse>> listarTodos() {
        return ResponseEntity.ok(pagoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PagoResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(pagoService.obtener(id));
    }

    @GetMapping("/sesion/{idSesion}")
    public ResponseEntity<PagoResponse> obtenerPorSesion(@PathVariable Long idSesion) {
        return ResponseEntity.ok(pagoService.obtenerPorSesion(idSesion));
    }

    @PostMapping
    public ResponseEntity<PagoResponse> crear(@Valid @RequestBody PagoRequest request) {
        return ResponseEntity.ok(pagoService.crear(request));
    }

    @PatchMapping("/{id}/confirmar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PagoResponse> confirmar(@PathVariable Long id) {
        return ResponseEntity.ok(pagoService.confirmarPago(id));
    }

    @PatchMapping("/{id}/fallido")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PagoResponse> marcarFallido(@PathVariable Long id) {
        return ResponseEntity.ok(pagoService.marcarFallido(id));
    }
}
