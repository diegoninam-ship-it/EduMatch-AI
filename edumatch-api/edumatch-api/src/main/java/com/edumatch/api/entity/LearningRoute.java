package com.edumatch.api.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name = "learning_routes")
public class LearningRoute {

    @Id
    @Column(name = "id", length = 32, updatable = false, nullable = false)
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(name = "title", length = 200, nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "generated_by_ai", nullable = false)
    private Boolean generatedByAi;

    @Column(name = "status", length = 20, nullable = false)
    private String status;

    @PrePersist
    private void generateId() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString().replace("-", "");
        }
        if (this.status == null) {
            this.status = "ACTIVE";
        }
        if (this.generatedByAi == null) {
            this.generatedByAi = false;
        }
    }
}
