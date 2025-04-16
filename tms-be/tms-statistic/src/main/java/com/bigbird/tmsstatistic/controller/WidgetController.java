package com.tms_statistic.controller;

import com.tms_statistic.entity.Widget;
import com.tms_statistic.service.WidgetService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class WidgetController {
    private final WidgetService widgetService;

    @SchemaMapping(typeName = "Query", field = "getWidgetByUserId")
    public List<Widget> getWidgetByUserId(@Argument String userId) {
        log.info("get widget by userId");
        return widgetService.getWidgetByUserId(userId);
    }

    @SchemaMapping(typeName = "Mutation", field = "addWidget")
    public String addWidget(@Argument String userId, @Argument List<Integer> widgetCodes) {
        log.info("add widget");
        widgetService.addWidget(userId, widgetCodes);
        return "Added widget";
    }

    @SchemaMapping(typeName = "Mutation", field = "deleteWidget")
    public String deleteWidget(@Argument List<Long> widgetIds) {
        log.info("delete widget");
        widgetService.deleteWidget(widgetIds);
        return "Deleted widget";
    }
}
