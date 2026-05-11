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
public class SesionService {

    private final SesionRepository sesionRepository;
    private final UsuarioRepository usuarioRepository;
    private final TutorRepository tutorRepository;
    private final MateriaRepository materiaRepository;
    private final FeedbackSesionRepository feedbackRepository;

    public List<SesionResponse> listarTodas() {
        return sesionRepository.findAll()
                .stream().map(SesionResponse::from).toList();
    }

    public List<SesionResponse> listarPorEstudiante(Long idEstudiante) {
        return sesionRepository.findByEstudianteIdUsuario(idEstudiante)
                .stream().map(SesionResponse::from).toList();
    }

    public List<SesionResponse> listarPorTutor(Long idTutor) {
        return sesionRepository.findByTutorIdTutor(idTutor)
                .stream().map(SesionResponse::from).toList();
    }

    public SesionResponse obtener(Long id) {
        Sesion s = sesionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sesión no encontrada: " + id));
        return SesionResponse.from(s);
    }

    public SesionResponse crear(SesionRequest request) {
        Usuario estudiante = usuarioRepository.findById(request.getIdEstudiante())
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado: " + request.getIdEstudiante()));
        Tutor tutor = tutorRepository.findById(request.getIdTutor())
                .orElseThrow(() -> new ResourceNotFoundException("Tutor no encontrado: " + request.getIdTutor()));
        Materia materia = materiaRepository.findById(request.getIdMateria())
                .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada: " + request.getIdMateria()));

        Sesion s = new Sesion();
        s.setEstudiante(estudiante);
        s.setTutor(tutor);
        s.setMateria(materia);
        s.setFecha(request.getFecha());
        s.setHoraInicio(request.getHoraInicio());
        s.setHoraFin(request.getHoraFin());
        s.setEnlaceReunion(request.getEnlaceReunion());
        s.setPlataforma(request.getPlataforma());
        s.setNotas(request.getNotas());
        s.setEstado(Sesion.EstadoSesion.PROGRAMADA);

        return SesionResponse.from(sesionRepository.save(s));
    }

    public SesionResponse cambiarEstado(Long id, String nuevoEstado) {
        Sesion s = sesionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sesión no encontrada: " + id));
        try {
            s.setEstado(Sesion.EstadoSesion.valueOf(nuevoEstado.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Estado inválido: " + nuevoEstado);
        }

        if (s.getEstado() == Sesion.EstadoSesion.COMPLETADA) {
            actualizarRatingTutor(s.getTutor().getIdTutor());
            s.getTutor().setTotalSesiones(s.getTutor().getTotalSesiones() + 1);
            tutorRepository.save(s.getTutor());
        }

        return SesionResponse.from(sesionRepository.save(s));
    }

    public SesionResponse actualizar(Long id, SesionRequest request) {
        Sesion s = sesionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sesión no encontrada: " + id));

        if (request.getFecha() != null) s.setFecha(request.getFecha());
        if (request.getHoraInicio() != null) s.setHoraInicio(request.getHoraInicio());
        if (request.getHoraFin() != null) s.setHoraFin(request.getHoraFin());
        if (request.getEnlaceReunion() != null) s.setEnlaceReunion(request.getEnlaceReunion());
        if (request.getPlataforma() != null) s.setPlataforma(request.getPlataforma());
        if (request.getNotas() != null) s.setNotas(request.getNotas());

        return SesionResponse.from(sesionRepository.save(s));
    }

    // --- Feedback ---

    public FeedbackResponse crearFeedback(FeedbackRequest request) {
        Sesion sesion = sesionRepository.findById(request.getIdSesion())
                .orElseThrow(() -> new ResourceNotFoundException("Sesión no encontrada: " + request.getIdSesion()));

        if (sesion.getEstado() != Sesion.EstadoSesion.COMPLETADA) {
            throw new BadRequestException("Solo se puede dar feedback a sesiones completadas");
        }

        if (feedbackRepository.findBySesionIdSesion(request.getIdSesion()).isPresent()) {
            throw new BadRequestException("Esta sesión ya tiene feedback registrado");
        }

        FeedbackSesion f = new FeedbackSesion();
        f.setSesion(sesion);
        f.setCalificacionCuantitativa(request.getCalificacionCuantitativa());
        f.setCalificacionCualitativa(request.getCalificacionCualitativa());
        f.setComentario(request.getComentario());

        FeedbackResponse resp = FeedbackResponse.from(feedbackRepository.save(f));
        actualizarRatingTutor(sesion.getTutor().getIdTutor());
        return resp;
    }

    public FeedbackResponse obtenerFeedbackPorSesion(Long idSesion) {
        FeedbackSesion f = feedbackRepository.findBySesionIdSesion(idSesion)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback no encontrado para sesión: " + idSesion));
        return FeedbackResponse.from(f);
    }

    // --- helper ---

    private void actualizarRatingTutor(Long idTutor) {
        Double rating = feedbackRepository.calcularRatingPromedioPorTutor(idTutor);
        if (rating != null) {
            Tutor tutor = tutorRepository.findById(idTutor).orElse(null);
            if (tutor != null) {
                tutor.setRatingPromedio(Math.round(rating * 10.0) / 10.0);
                tutorRepository.save(tutor);
            }
        }
    }
}
