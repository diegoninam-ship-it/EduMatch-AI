package com.edumatch.api.service;

import com.edumatch.api.dto.PagoRequest;
import com.edumatch.api.dto.PagoResponse;
import com.edumatch.api.entity.Pago;
import com.edumatch.api.entity.Sesion;
import com.edumatch.api.exception.BadRequestException;
import com.edumatch.api.exception.ResourceNotFoundException;
import com.edumatch.api.repository.PagoRepository;
import com.edumatch.api.repository.SesionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PagoService {

    private final PagoRepository pagoRepository;
    private final SesionRepository sesionRepository;

    public List<PagoResponse> listarTodos() {
        return pagoRepository.findAll()
                .stream().map(PagoResponse::from).toList();
    }

    public PagoResponse obtener(Long id) {
        Pago p = pagoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado: " + id));
        return PagoResponse.from(p);
    }

    public PagoResponse obtenerPorSesion(Long idSesion) {
        Pago p = pagoRepository.findBySesionIdSesion(idSesion)
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado para sesión: " + idSesion));
        return PagoResponse.from(p);
    }

    public PagoResponse crear(PagoRequest request) {
        Sesion sesion = sesionRepository.findById(request.getIdSesion())
                .orElseThrow(() -> new ResourceNotFoundException("Sesión no encontrada: " + request.getIdSesion()));

        if (pagoRepository.findBySesionIdSesion(request.getIdSesion()).isPresent()) {
            throw new BadRequestException("Esta sesión ya tiene un pago registrado");
        }

        Pago p = new Pago();
        p.setSesion(sesion);
        p.setMonto(request.getMonto());
        p.setEstado(Pago.EstadoPago.PENDIENTE);
        return PagoResponse.from(pagoRepository.save(p));
    }

    public PagoResponse confirmarPago(Long id) {
        Pago p = pagoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado: " + id));
        p.setEstado(Pago.EstadoPago.PAGADO);
        p.setFechaPago(LocalDateTime.now());
        return PagoResponse.from(pagoRepository.save(p));
    }

    public PagoResponse marcarFallido(Long id) {
        Pago p = pagoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado: " + id));
        p.setEstado(Pago.EstadoPago.FALLIDO);
        return PagoResponse.from(pagoRepository.save(p));
    }
}
