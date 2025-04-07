package com.bigbird.tmsrepo.service;

import com.bigbird.tmsrepo.dto.PositionDTO;
import com.bigbird.tmsrepo.dto.PositionPage;

import java.util.List;

public interface PositionService {
    PositionPage getAllPosition(int page, int size);

    PositionDTO savePosition(PositionDTO positionDTO);

    void deletePositions(List<Long> ids);
}
