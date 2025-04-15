package com.bigbird.tmsrepo.repository;

import com.bigbird.tmsrepo.entity.Position;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface PositionRepository extends JpaRepository<Position, Long> {
    @Query(nativeQuery = true, value = "select p.position_id, p.description, p.position_name, p.created_at, p.updated_at " +
            "from position p")
    Page<Position> getALlPosition(Pageable pageable);

    @Query(nativeQuery = true, value = "select p.position_id, p.description, p.position_name, p.created_at, p.updated_at " +
            "from position p where p.position_id = :position_id")
    Position getPositionById(@Param("position_id") Long position_id);
}
