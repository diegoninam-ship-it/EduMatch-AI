package com.edumatch.api.controller;

import com.edumatch.api.dto.*;
import com.edumatch.api.service.RutaAprendizajeService;
import com.edumatch.api.service.UsuarioService;
import jakarta.validation.Valid;
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
    private final UsuarioService usuarioService;

    @GetMapping("/usuario/{idUsuario}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ESTUDIANTE')")
    public ResponseEntity<List<RutaAprendizajeResponse>> listarPorUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(rutaService.listarPorUsuario(idUsuario));
    }

    @GetMapping("/mis-rutas")
    public ResponseEntity<List<RutaAprendizajeResponse>> misRutas(Authentication authentication) {
        UsuarioResponse me = usuarioService.obtenerPorEmail(authentication.getName());
        return ResponseEntity.ok(rutaService.listarPorUsuario(me.getIdUsuario()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RutaAprendizajeResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(rutaService.obtener(id));
    }

    @PostMapping("/usuario/{idUsuario}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ESTUDIANTE')")
    public ResponseEntity<RutaAprendizajeResponse> crear(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(rutaService.crear(idUsuario));
    }

    @PostMapping("/mi-ruta")
    public ResponseEntity<RutaAprendizajeResponse> crearMiRuta(Authentication authentication) {
        UsuarioResponse me = usuarioService.obtenerPorEmail(authentication.getName());
        return ResponseEntity.ok(rutaService.crear(me.getIdUsuario()));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<RutaAprendizajeResponse> cambiarEstado(@PathVariable Long id,
                                                                   @RequestParam String estado) {
        return ResponseEntity.ok(rutaService.cambiarEstado(id, estado));
    }

    // --- Detalles ---

    @GetMapping("/{id}/detalles")
    public ResponseEntity<List<RutaDetalleResponse>> listarDetalles(@PathVariable Long id) {
        return ResponseEntity.ok(rutaService.listarDetalles(id));
    }

    @PostMapping("/{id}/temas/{idTema}")
    public ResponseEntity<RutaDetalleResponse> agregarTema(@PathVariable Long id,
                                                            @PathVariable Integer idTema,
                                                            @RequestParam(required = false) Integer orden) {
        return ResponseEntity.ok(rutaService.agregarTema(id, idTema, orden));
    }

    @PatchMapping("/detalles/{idDetalle}/estado")
    public ResponseEntity<RutaDetalleResponse> actualizarEstadoDetalle(@PathVariable Long idDetalle,
                                                                         @RequestParam String estado) {
        return ResponseEntity.ok(rutaService.actualizarEstadoDetalle(idDetalle, estado));
    }

    @DeleteMapping("/detalles/{idDetalle}")
    public ResponseEntity<Void> eliminarDetalle(@PathVariable Long idDetalle) {
        rutaService.eliminarDetalle(idDetalle);
        return ResponseEntity.noContent().build();
    }

    // --- Progreso ---

    @GetMapping("/progreso/usuario/{idUsuario}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ESTUDIANTE')")
    public ResponseEntity<List<ProgresoTemaResponse>> listarProgreso(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(rutaService.listarProgreso(idUsuario));
    }

    @GetMapping("/progreso/me")
    public ResponseEntity<List<ProgresoTemaResponse>> miProgreso(Authentication authentication) {
        UsuarioResponse me = usuarioService.obtenerPorEmail(authentication.getName());
        return ResponseEntity.ok(rutaService.listarProgreso(me.getIdUsuario()));
    }

    @PostMapping("/progreso")
    public ResponseEntity<ProgresoTemaResponse> registrarProgreso(@Valid @RequestBody ProgresoTemaRequest request) {
        return ResponseEntity.ok(rutaService.registrarOActualizarProgreso(request));
    }
}
