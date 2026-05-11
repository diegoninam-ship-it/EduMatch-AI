package com.edumatch.api.controller;

import com.edumatch.api.entity.Subject;
import com.edumatch.api.service.MateriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materias")
@RequiredArgsConstructor
public class MateriaController {

    private final MateriaService materiaService;

    @GetMapping
    public ResponseEntity<List<Subject>> listar() {
        return ResponseEntity.ok(materiaService.listarActivas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subject> obtener(@PathVariable String id) {
        return ResponseEntity.ok(materiaService.obtener(id));
    }
}
