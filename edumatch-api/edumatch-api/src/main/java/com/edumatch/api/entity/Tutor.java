package com.edumatch.api.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Entity
@Table(name = "tutors")
public class Tutor {

    @Id
    @Column(name = "id", length = 32, updatable = false, nullable = false)
    private String id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "biography", columnDefinition = "TEXT", nullable = false)
    private String biography;

    @Column(name = "experience_years", nullable = false)
    private Integer experienceYears;

    @Column(name = "hourly_rate", precision = 8, scale = 2, nullable = false)
    private BigDecimal hourlyRate;

    @Column(name = "rating", precision = 3, scale = 2, nullable = false)
    private BigDecimal rating;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable;
}
