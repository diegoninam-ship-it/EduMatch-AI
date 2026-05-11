package com.edumatch.api.service;

import com.edumatch.api.dto.*;
import com.edumatch.api.entity.*;
import com.edumatch.api.exception.BadRequestException;
import com.edumatch.api.exception.ResourceNotFoundException;
import com.edumatch.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RutaAprendizajeService {

    private final RutaAprendizajeRepository rutaRepository;
    private final RutaDetalleRepository detalleRepository;
    private final UsuarioRepository usuarioRepository;
    private final TemaRepository temaRepository;
    private final ProgresoTemaRepository progresoRepository;

    // --- Rutas ---

    public List<RutaAprendizajeResponse> listarPorUsuario(Long idUsuario) {
        return rutaRepository.findByUsuarioIdUsuario(idUsuario)
                .stream().map(RutaAprendizajeResponse::from).toList();
    }

    public RutaAprendizajeResponse obtener(Long id) {
        RutaAprendizaje r = rutaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ruta no encontrada: " + id));
        return RutaAprendizajeResponse.from(r);
    }

    public RutaAprendizajeResponse crear(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + idUsuario));

        RutaAprendizaje r = new RutaAprendizaje();
        r.setUsuario(usuario);
        r.setEstado(RutaAprendizaje.EstadoRuta.ACTIVA);
        return RutaAprendizajeResponse.from(rutaRepository.save(r));
    }

    public RutaAprendizajeResponse cambiarEstado(Long id, String nuevoEstado) {
        RutaAprendizaje r = rutaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ruta no encontrada: " + id));
        try {
            r.setEstado(RutaAprendizaje.EstadoRuta.valueOf(nuevoEstado.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Estado inválido: " + nuevoEstado);
        }
        return RutaAprendizajeResponse.from(rutaRepository.save(r));
    }

    // --- Detalles (temas de la ruta) ---

    public List<RutaDetalleResponse> listarDetalles(Long idRuta) {
        return detalleRepository.findByRutaIdRutaOrderByOrdenAsc(idRuta)
                .stream().map(RutaDetalleResponse::from).toList();
    }

    public RutaDetalleResponse agregarTema(Long idRuta, Integer idTema, Integer orden) {
        RutaAprendizaje ruta = rutaRepository.findById(idRuta)
                .orElseThrow(() -> new ResourceNotFoundException("Ruta no encontrada: " + idRuta));
        Tema tema = temaRepository.findById(idTema)
                .orElseThrow(() -> new ResourceNotFoundException("Tema no encontrado: " + idTema));

        RutaDetalle d = new RutaDetalle();
        d.setRuta(ruta);
        d.setTema(tema);
        d.setOrden(orden != null ? orden : 1);
        d.setEstado(RutaDetalle.EstadoDetalle.PENDIENTE);
        return RutaDetalleResponse.from(detalleRepository.save(d));
    }

    public RutaDetalleResponse actualizarEstadoDetalle(Long idDetalle, String nuevoEstado) {
        RutaDetalle d = detalleRepository.findById(idDetalle)
                .orElseThrow(() -> new ResourceNotFoundException("Detalle no encontrado: " + idDetalle));
        try {
            d.setEstado(RutaDetalle.EstadoDetalle.valueOf(nuevoEstado.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Estado inválido: " + nuevoEstado);
        }
        return RutaDetalleResponse.from(detalleRepository.save(d));
    }

    public void eliminarDetalle(Long idDetalle) {
        detalleRepository.deleteById(idDetalle);
    }

    // --- Progreso ---

    public List<ProgresoTemaResponse> listarProgreso(Long idUsuario) {
        return progresoRepository.findByUsuarioIdUsuario(idUsuario)
                .stream().map(ProgresoTemaResponse::from).toList();
    }

    public ProgresoTemaResponse registrarOActualizarProgreso(ProgresoTemaRequest request) {
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + request.getIdUsuario()));
        Tema tema = temaRepository.findById(request.getIdTema())
                .orElseThrow(() -> new ResourceNotFoundException("Tema no encontrado: " + request.getIdTema()));

        ProgresoTema progreso = progresoRepository
                .findByUsuarioIdUsuarioAndTemaIdTema(request.getIdUsuario(), request.getIdTema())
                .orElse(new ProgresoTema());

        progreso.setUsuario(usuario);
        progreso.setTema(tema);
        if (request.getEstado() != null) progreso.setEstado(request.getEstado());
        if (request.getPorcentajeAvance() != null) progreso.setPorcentajeAvance(request.getPorcentajeAvance());

        return ProgresoTemaResponse.from(progresoRepository.save(progreso));
    }
}
