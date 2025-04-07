package com.bigbird.tmsrepo.dto;

import graphql.relay.PageInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotifyPage {
    private List<NotifyDTO> notifies;
     private PageInfo pageInfo;
}
