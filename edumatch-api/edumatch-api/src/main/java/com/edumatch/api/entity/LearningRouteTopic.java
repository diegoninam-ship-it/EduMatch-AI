package com.edumatch.api.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "learning_route_topics")
public class LearningRouteTopic {

    @Id
    @Column(name = "id", length = 32, updatable = false, nullable = false)
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "learning_route_id", nullable = false)
    private LearningRoute learningRoute;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @Column(name = "order", nullable = false)
    private Integer order;

    @Column(name = "status", length = 20, nullable = false)
    private String status;
}
