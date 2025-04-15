package com.bigbird.tmsrepo.controller;

import com.bigbird.tmsrepo.dto.PositionDTO;
import com.bigbird.tmsrepo.dto.PositionPage;
import com.bigbird.tmsrepo.service.PositionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@Validated
public class PositionController {

    private final PositionService positionService;

    @SchemaMapping(typeName = "Query", field = "getPosition")
    public PositionPage getPosition(@Argument int page, @Argument int size) {
        return positionService.getAllPosition(page, size);
    }

    @SchemaMapping(typeName = "Mutation", field = "savePosition")
    public PositionDTO savePosition(@Argument PositionDTO position) {
        return positionService.savePosition(position);
    }

    @SchemaMapping(typeName = "Mutation", field = "deletePositions")
    public String deletePositions(@Argument List<Long> positionIds) {
        positionService.deletePositions(positionIds);
        return "Deleted!!!";
    }
}
