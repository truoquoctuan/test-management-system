package com.tms_run.controller;

import com.tms_run.dto.LabelDTO;
import com.tms_run.dto.LabelPage;
import com.tms_run.service.LabelService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class LabelController {
    private final LabelService labelService;

    @SchemaMapping(typeName = "Mutation", field = "createLabel")
    public LabelDTO createLabel(@Argument("input") LabelDTO labelDTO) {
        return labelService.createLabel(labelDTO);
    }

    @SchemaMapping(typeName = "Query", field = "getAllLabelsByTestPlanId")
    public List<LabelDTO> getAllLabelsByTestPlanId(@Argument Long testPlanId) {
        return labelService.getAllLabelsByTestPlanId(testPlanId);
    }

    @SchemaMapping(typeName = "Mutation", field = "removeLabel")
    public void removeLabel(@Argument List<Long> labelIds) {
        labelService.removeLabel(labelIds);
    }

    @SchemaMapping(typeName = "Mutation", field = "updateLabel")
    public LabelDTO updateLabel(@Argument("input") LabelDTO labelDTO, @Argument Long labelId) {
        return labelService.updateLabel(labelDTO, labelId);
    }

    @SchemaMapping(typeName = "Query", field = "getAllLabelByLabelTypeAndEntityId")
    public LabelPage getAllLabelByLabelTypeAndEntityId(@Argument int labelType, @Argument Long entityId,
                                                       @Argument int page, @Argument int size) {
        return labelService.getAllLabelByLabelTypeAndEntityId(labelType, entityId, page, size);
    }

    @SchemaMapping(typeName = "Mutation", field = "modifyLabelInIssues")
    public Boolean modifyLabelInIssues(@Argument String labelIds, @Argument Long issuesId) {
        return labelService.modifyLabelInIssues(labelIds, issuesId);
    }
}
