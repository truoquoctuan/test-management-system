package com.bigbird.tmsrepo.dto;

import com.bigbird.tmsrepo.entity.Position;
import graphql.relay.PageInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PositionPage {
    private List<Position> positions;

    private PageInfo pageInfo;
}
