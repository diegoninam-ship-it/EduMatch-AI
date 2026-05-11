package com.edumatch.api.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "tutor_materia")
public class TutorMateria {

    @EmbeddedId
    private TutorMateriaId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idTutor")
    @JoinColumn(name = "id_tutor")
    private Tutor tutor;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idMateria")
    @JoinColumn(name = "id_materia")
    private Materia materia;

    @Embeddable
    @Data
    public static class TutorMateriaId implements java.io.Serializable {
        @Column(name = "id_tutor")
        private Long idTutor;

        @Column(name = "id_materia")
        private Integer idMateria;
    }
}
