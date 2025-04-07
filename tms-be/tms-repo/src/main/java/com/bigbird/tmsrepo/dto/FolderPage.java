package com.bigbird.tmsrepo.dto;

import graphql.relay.PageInfo;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class FolderPage {

    private List<FolderDTO> folders;

    private PageInfo pageInfo;
}
