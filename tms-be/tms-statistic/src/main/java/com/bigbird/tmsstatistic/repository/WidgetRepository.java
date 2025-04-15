package com.tms_statistic.repository;

import com.tms_statistic.entity.Widget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WidgetRepository extends JpaRepository<Widget, Long> {
    List<Widget> getWidgetsByUserId(String userId);

    Boolean existsByUserIdAndWidgetCode(String userId, Integer widgetCode);
}
