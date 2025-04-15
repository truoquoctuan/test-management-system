package com.bigbird.tmsrepo.controller;

import com.bigbird.tmsrepo.dto.LabelDTO;
import com.bigbird.tmsrepo.dto.LabelPage;
import com.bigbird.tmsrepo.service.LabelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class LabelController {

    private final LabelService labelService;

    @SchemaMapping(typeName = "Query", field = "getAllLabel")
    public LabelPage getAllLabel(@Argument Long testPlanId, @Argument String labelName, @Argument List<Integer> labelTypes, @Argument Integer page, @Argument Integer size) {
        log.info("Get all label in testPlan");
        return labelService.getAllLabel(testPlanId, labelName, labelTypes, page, size);
    }

    @SchemaMapping(typeName = "Mutation", field = "saveLabel")
    public LabelDTO saveLabel(@Argument LabelDTO label) {
        log.info("Save label in test plan");
        return labelService.saveLabel(label);
    }

    @SchemaMapping(typeName = "Mutation", field = "deleteLabels")
    public Boolean deleteLabels(@Argument List<Long> labelIds) {
        log.info("Delete labels");
        return labelService.deleteLabels(labelIds);
    }
}
