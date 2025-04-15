package com.bigbird.tmsrepo.dto;

import com.bigbird.tmsrepo.cmmn.base.PageInfo;
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
