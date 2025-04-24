package com.bzcom.bzc_be.service.impl;

import com.bzcom.bzc_be.cmmn.base.Response;
import com.bzcom.bzc_be.cmmn.util.CmdUserActivity;
import com.bzcom.bzc_be.cmmn.util.Constant;
import com.bzcom.bzc_be.dto.UserActivityDTO;
import com.bzcom.bzc_be.dto.UserDTO;
import com.bzcom.bzc_be.entity.UserActivity;
import com.bzcom.bzc_be.repository.UserActivityRepository;
import com.bzcom.bzc_be.service.UserActivityService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserActivityServiceImpl implements UserActivityService {

    @Autowired
    private UserActivityRepository userActivityRepository;

    @Autowired
    private ModelMapper mapper;

    @Override
    public ResponseEntity<?> getUserActivities(String userId, Pageable pageable) {
        if (pageable.getSort() == Sort.unsorted()) {
            Sort.Order order = new Sort.Order(Sort.Direction.DESC, "activityDateTime");
            Sort sort = Sort.by(order);
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        }
        Page<UserActivityDTO> dataList = userActivityRepository.getUserActivities(userId, pageable);
        Map<String, Object> response = new HashMap<>();
        response.put("dataList", dataList.getContent());
        response.put("currentPage", dataList.getNumber());
        response.put("totalItems", dataList.getTotalElements());
        response.put("totalPages", dataList.getTotalPages());
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<?> addUserActivity(UserActivityDTO userActivityDTO) {

        UserActivity userActivity = mapper.map(userActivityDTO, UserActivity.class);

        userActivity.setActivityDateTime(LocalDateTime.now());
        if (userActivityDTO.command == CmdUserActivity.CMD_CREATED_USER) {
            userActivity.setContent(Constant.cmdCreatedUserEN);
        }
        if (userActivityDTO.command == CmdUserActivity.CMD_UPDATED_USER) {
            userActivity.setContent(Constant.cmdUpdatedUserEN);
        }
        if (userActivityDTO.command == CmdUserActivity.CMD_DEACTIVATED_USER) {
            userActivity.setContent(Constant.cmdDeactivatedEN);
        }
        if (userActivityDTO.command == CmdUserActivity.CMD_ACTIVATED_USER) {
            userActivity.setContent(Constant.cmdActivatedUserEN);
        }

        UserActivity resultSave = userActivityRepository.save(userActivity);
        if (resultSave.getUserActivityId() != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body("Saved!");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error!");
        }
    }
}
