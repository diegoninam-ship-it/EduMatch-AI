package com.edumatch.api.repository;

import com.edumatch.api.entity.AvailabilitySlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, String> {
    List<AvailabilitySlot> findByTutorId(String tutorId);
    List<AvailabilitySlot> findByTutorIdAndIsActiveTrue(String tutorId);
}
