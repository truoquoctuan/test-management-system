package com.tms_statistic.service;

import com.tms_statistic.entity.Widget;

import java.util.List;

public interface WidgetService {
    List<Widget> getWidgetByUserId(String userId);

    void addWidget(String userId, List<Integer> widgetCodes);

    void deleteWidget(List<Long> widgetIds);
}
