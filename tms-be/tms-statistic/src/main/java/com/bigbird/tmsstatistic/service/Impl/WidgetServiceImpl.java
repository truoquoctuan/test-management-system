package com.tms_statistic.service.Impl;

import com.tms_statistic.cmmn.exception.ResourceNotFoundException;
import com.tms_statistic.entity.Widget;
import com.tms_statistic.repository.WidgetRepository;
import com.tms_statistic.service.WidgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WidgetServiceImpl implements WidgetService {
    private final WidgetRepository widgetRepository;

    @Override
    public List<Widget> getWidgetByUserId(String userId) {
        try {
            return  widgetRepository.getWidgetsByUserId(userId);
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Can not get widget by userId: ", userId);
        }
    }

    @Override
    public void addWidget(String userId, List<Integer> widgetCodes) {
        try {
            for (Integer widgetCode : widgetCodes) {
                if (!widgetRepository.existsByUserIdAndWidgetCode(userId, widgetCode)) {
                    Widget widget = new Widget();
                    widget.setUserId(userId);
                    widget.setWidgetCode(widgetCode);
                    widgetRepository.save(widget);
                }
            }
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Can not get widget by userId: ", userId);
        }
    }

    @Override
    public void deleteWidget(List<Long> widgetIds) {
        try {
            for (Long id : widgetIds) {
                widgetRepository.deleteById(id);
            }
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }
}
