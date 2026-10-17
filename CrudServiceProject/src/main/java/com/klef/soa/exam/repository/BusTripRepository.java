
package com.klef.soa.exam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klef.soa.exam.entity.BusTripEntity;

@Repository
public interface BusTripRepository
        extends JpaRepository<BusTripEntity, Long> {

}
