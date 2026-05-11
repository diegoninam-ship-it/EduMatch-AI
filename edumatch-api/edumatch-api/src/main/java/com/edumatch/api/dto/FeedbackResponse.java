package com.edumatch.api.dto;

import com.edumatch.api.entity.FeedbackSesion;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FeedbackResponse {
    private Long idFeedback;
    private Long idSesion;
    private Integer calificacionCuantitativa;
    private String calificacionCualitativa;
    private String comentario;
    private LocalDateTime fechaRegistro;

    public static FeedbackResponse from(FeedbackSesion f) {
        FeedbackResponse r = new FeedbackResponse();
        r.setIdFeedback(f.getIdFeedback());
        r.setIdSesion(f.getSesion().getIdSesion());
        r.setCalificacionCuantitativa(f.getCalificacionCuantitativa());
        r.setCalificacionCualitativa(f.getCalificacionCualitativa());
        r.setComentario(f.getComentario());
        r.setFechaRegistro(f.getFechaRegistro());
        return r;
    }
}
