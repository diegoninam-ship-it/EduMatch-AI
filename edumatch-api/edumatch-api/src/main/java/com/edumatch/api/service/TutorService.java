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
public class TutorService {

    private final TutorRepository tutorRepository;
    private final UsuarioRepository usuarioRepository;
    private final MateriaRepository materiaRepository;
    private final TutorMateriaRepository tutorMateriaRepository;
    private final DisponibilidadTutorRepository disponibilidadRepository;

    public List<TutorResponse> listarActivos() {
        return tutorRepository.findByEstadoTrue()
                .stream().map(TutorResponse::from).toList();
    }

    public List<TutorResponse> listarVerificados() {
        return tutorRepository.findByVerificadoTrueAndEstadoTrue()
                .stream().map(TutorResponse::from).toList();
    }

    public TutorResponse obtener(Long id) {
        Tutor t = tutorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tutor no encontrado: " + id));
        return TutorResponse.from(t);
    }

    public TutorResponse obtenerPorUsuario(Long idUsuario) {
        Tutor t = tutorRepository.findByUsuarioIdUsuario(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Tutor no encontrado para usuario: " + idUsuario));
        return TutorResponse.from(t);
    }

    public TutorResponse crear(Long idUsuario, TutorRequest request) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + idUsuario));

        if (tutorRepository.findByUsuarioIdUsuario(idUsuario).isPresent()) {
            throw new BadRequestException("El usuario ya tiene un perfil de tutor");
        }

        Tutor t = new Tutor();
        t.setUsuario(usuario);
        aplicarDatos(t, request);
        return TutorResponse.from(tutorRepository.save(t));
    }

    public TutorResponse actualizar(Long id, TutorRequest request) {
        Tutor t = tutorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tutor no encontrado: " + id));
        aplicarDatos(t, request);
        return TutorResponse.from(tutorRepository.save(t));
    }

    public TutorResponse verificar(Long id) {
        Tutor t = tutorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tutor no encontrado: " + id));
        t.setVerificado(true);
        return TutorResponse.from(tutorRepository.save(t));
    }

    public void desactivar(Long id) {
        Tutor t = tutorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tutor no encontrado: " + id));
        t.setEstado(false);
        tutorRepository.save(t);
    }

    // --- Materias del tutor ---

    public List<MateriaResponse> listarMaterias(Long idTutor) {
        return tutorMateriaRepository.findByTutorIdTutor(idTutor)
                .stream()
                .map(tm -> MateriaResponse.from(tm.getMateria()))
                .toList();
    }

    public void agregarMateria(Long idTutor, Integer idMateria) {
        Tutor tutor = tutorRepository.findById(idTutor)
                .orElseThrow(() -> new ResourceNotFoundException("Tutor no encontrado: " + idTutor));
        Materia materia = materiaRepository.findById(idMateria)
                .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada: " + idMateria));

        TutorMateria.TutorMateriaId compositeId = new TutorMateria.TutorMateriaId();
        compositeId.setIdTutor(idTutor);
        compositeId.setIdMateria(idMateria);

        if (tutorMateriaRepository.existsById(compositeId)) {
            throw new BadRequestException("El tutor ya tiene asignada esta materia");
        }

        TutorMateria tm = new TutorMateria();
        tm.setId(compositeId);
        tm.setTutor(tutor);
        tm.setMateria(materia);
        tutorMateriaRepository.save(tm);
    }

    public void quitarMateria(Long idTutor, Integer idMateria) {
        TutorMateria.TutorMateriaId compositeId = new TutorMateria.TutorMateriaId();
        compositeId.setIdTutor(idTutor);
        compositeId.setIdMateria(idMateria);
        tutorMateriaRepository.deleteById(compositeId);
    }

    // --- Disponibilidad ---

    public List<DisponibilidadResponse> listarDisponibilidad(Long idTutor) {
        return disponibilidadRepository.findByTutorIdTutor(idTutor)
                .stream().map(DisponibilidadResponse::from).toList();
    }

    public DisponibilidadResponse agregarDisponibilidad(Long idTutor, DisponibilidadRequest request) {
        Tutor tutor = tutorRepository.findById(idTutor)
                .orElseThrow(() -> new ResourceNotFoundException("Tutor no encontrado: " + idTutor));

        DisponibilidadTutor d = new DisponibilidadTutor();
        d.setTutor(tutor);
        d.setDiaSemana(request.getDiaSemana());
        d.setHoraInicio(request.getHoraInicio());
        d.setHoraFin(request.getHoraFin());
        d.setEstado(request.getEstado() != null
                ? request.getEstado() : DisponibilidadTutor.EstadoDisponibilidad.DISPONIBLE);
        return DisponibilidadResponse.from(disponibilidadRepository.save(d));
    }

    public void eliminarDisponibilidad(Long idDisponibilidad) {
        disponibilidadRepository.deleteById(idDisponibilidad);
    }

    // --- helpers ---

    private void aplicarDatos(Tutor t, TutorRequest request) {
        if (request.getPrecioSesion() != null) t.setPrecioSesion(request.getPrecioSesion());
        if (request.getDescripcion() != null) t.setDescripcion(request.getDescripcion());
        if (request.getBiografia() != null) t.setBiografia(request.getBiografia());
        if (request.getExperiencia() != null) t.setExperiencia(request.getExperiencia());
        if (request.getFotoUrl() != null) t.setFotoUrl(request.getFotoUrl());
        if (request.getUbicacion() != null) t.setUbicacion(request.getUbicacion());
    }
}
