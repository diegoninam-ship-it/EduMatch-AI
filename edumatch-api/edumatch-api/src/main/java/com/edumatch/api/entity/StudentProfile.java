package com.edumatch.api.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name = "student_profiles")
public class StudentProfile {

    @Id
    @Column(name = "id", length = 32, updatable = false, nullable = false)
    private String id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false, unique = true)
    private User student;

    @Column(name = "preferred_learning_style", length = 100)
    private String preferredLearningStyle;

    @Column(name = "skill_level", length = 20, nullable = false)
    private String skillLevel;

    @Column(name = "goals", columnDefinition = "TEXT")
    private String goals;

    @PrePersist
    private void generateId() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString().replace("-", "");
        }
        if (this.skillLevel == null) {
            this.skillLevel = "BEGINNER";
        }
    }
}
