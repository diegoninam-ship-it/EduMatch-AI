package com.edumatch.api.service;

import com.edumatch.api.dto.*;
import com.edumatch.api.entity.Materia;
import com.edumatch.api.entity.Modulo;
import com.edumatch.api.entity.Tema;
import com.edumatch.api.exception.ResourceNotFoundException;
import com.edumatch.api.repository.MateriaRepository;
import com.edumatch.api.repository.ModuloRepository;
import com.edumatch.api.repository.TemaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MateriaService {

    private final MateriaRepository materiaRepository;
    private final ModuloRepository moduloRepository;
    private final TemaRepository temaRepository;

    public List<MateriaResponse> listarActivas() {
        return materiaRepository.findByEstadoTrue()
                .stream().map(MateriaResponse::from).toList();
    }

    public List<MateriaResponse> listarTodas() {
        return materiaRepository.findAll()
                .stream().map(MateriaResponse::from).toList();
    }

    public MateriaResponse obtener(Integer id) {
        Materia m = materiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada: " + id));
        return MateriaResponse.from(m);
    }

    public MateriaResponse crear(MateriaRequest request) {
        Materia m = new Materia();
        m.setNombre(request.getNombre());
        m.setEstado(true);
        return MateriaResponse.from(materiaRepository.save(m));
    }

    public MateriaResponse actualizar(Integer id, MateriaRequest request) {
        Materia m = materiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada: " + id));
        m.setNombre(request.getNombre());
        return MateriaResponse.from(materiaRepository.save(m));
    }

    public void desactivar(Integer id) {
        Materia m = materiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada: " + id));
        m.setEstado(false);
        materiaRepository.save(m);
    }

    // --- Módulos ---

    public List<ModuloResponse> listarModulos(Integer idMateria) {
        return moduloRepository.findByMateriaIdMateriaOrderByOrdenAsc(idMateria)
                .stream().map(ModuloResponse::from).toList();
    }

    public ModuloResponse crearModulo(ModuloRequest request) {
        Materia materia = materiaRepository.findById(request.getIdMateria())
                .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada"));
        Modulo m = new Modulo();
        m.setNombre(request.getNombre());
        m.setOrden(request.getOrden());
        m.setMateria(materia);
        return ModuloResponse.from(moduloRepository.save(m));
    }

    // --- Temas ---

    public List<TemaResponse> listarTemas(Integer idModulo) {
        return temaRepository.findByModuloIdModuloOrderByOrdenAsc(idModulo)
                .stream().map(TemaResponse::from).toList();
    }

    public TemaResponse crearTema(TemaRequest request) {
        Modulo modulo = moduloRepository.findById(request.getIdModulo())
                .orElseThrow(() -> new ResourceNotFoundException("Módulo no encontrado"));
        Tema t = new Tema();
        t.setNombre(request.getNombre());
        t.setDescripcion(request.getDescripcion());
        t.setNivelDificultad(request.getNivelDificultad() != null
                ? request.getNivelDificultad() : Tema.NivelDificultad.BASICO);
        t.setOrden(request.getOrden());
        t.setModulo(modulo);
        return TemaResponse.from(temaRepository.save(t));
    }
}
