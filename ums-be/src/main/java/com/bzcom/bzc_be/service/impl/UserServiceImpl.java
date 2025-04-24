package com.bzcom.bzc_be.service.impl;

import com.bzcom.bzc_be.cmmn.base.Response;
import com.bzcom.bzc_be.cmmn.util.APIUtil;
import com.bzcom.bzc_be.cmmn.util.UserUtil;
import com.bzcom.bzc_be.dto.UserDTO;
import com.bzcom.bzc_be.dto.request.UserStatusRequest;
import com.bzcom.bzc_be.dto.request.UserUpdateRequest;
import com.bzcom.bzc_be.dto.response.UserPublicDTO;
import com.bzcom.bzc_be.entity.User;
import com.bzcom.bzc_be.repository.UserRepository;
import com.bzcom.bzc_be.service.UserService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");

    @Value("${keycloak.url.account}")
    private String accountUrl;

    @Value("${keycloak.url.user}")
    private String userUrl;

    @Autowired
    private UserRepository userRepository;

    public ResponseEntity<?> getUsers(String groupId, String userName, int enabled, Pageable pageable) {
        if (pageable.getSort() == Sort.unsorted()) {
            Sort.Order order = new Sort.Order(Sort.Direction.DESC, "CREATED_TIMESTAMP");
            Sort sort = Sort.by(order);
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        } else {
            String column = StringUtils.substringBefore(pageable.getSort().toString(), ":");
            String sortDirection = StringUtils.substringAfter(pageable.getSort().toString(), ": ");
            Sort.Order order = null;
            order = new Sort.Order(Sort.Direction.fromString(sortDirection), column);

            Sort sort = Sort.by(order);
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        }
        Page<Map<String, Object>> dataList = userRepository.getUsers(groupId, userName, enabled, pageable);
        Map<String, Object> response = new HashMap<>();
        response.put("dataList", dataList.getContent());
        response.put("currentPage", dataList.getNumber());
        response.put("totalItems", dataList.getTotalElements());
        response.put("totalPages", dataList.getTotalPages());
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> getUsersNotInGroup(String groupId, String searchName, Pageable pageable) {
        Page<User> dataList = userRepository.getUsersNotInGroup(groupId, searchName, pageable);
        Map<String, Object> response = new HashMap<>();
        response.put("dataList", dataList.getContent());
        response.put("currentPage", dataList.getNumber());
        response.put("totalItems", dataList.getTotalElements());
        response.put("totalPages", dataList.getTotalPages());
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> updateUser(UserDTO userDTO) {
        try {
            Optional<User> user = userRepository.findById(userDTO.getUserId());
            if (user.isPresent()) {
                boolean isRealmManagerRole = UserUtil.checkRealmManagerRole();
                String url = isRealmManagerRole
                        ? userUrl.replace("{userId}", userDTO.getUserId())
                        : accountUrl;
                HttpMethod methodRequest = isRealmManagerRole
                        ? HttpMethod.PUT
                        : HttpMethod.POST;

                UserUpdateRequest userUpdateRequest = new UserUpdateRequest();
                Map<String, List<String>> attributes = new HashMap<>();

                userUpdateRequest.setUsername(user.get().getUserName());
                userUpdateRequest.setFirstName(userDTO.getFirstName());
                userUpdateRequest.setLastName(userDTO.getLastName());
                userUpdateRequest.setEmail(userDTO.getEmail());
                userUpdateRequest.setAttributes(attributes);

                userUpdateRequest.setAttributes("address", userDTO.getAddress());
                userUpdateRequest.setAttributes("gender", userDTO.getGender());
                userUpdateRequest.setAttributes("phoneNumber", userDTO.getPhoneNumber());
                userUpdateRequest.setAttributes("userCode", userDTO.getUserCode());
                userUpdateRequest.setAttributes("position", userDTO.getPosition());
                userUpdateRequest.setAttributes("birthDate", userDTO.getBirthDate().format(formatter));
                userUpdateRequest.setAttributes("startDate", userDTO.getStartDate().format(formatter));

                ResponseEntity<?> result = APIUtil.exchange(
                        MediaType.APPLICATION_JSON, UserUtil.getToken(),
                        url, methodRequest,
                        Object.class, userUpdateRequest);
                if (result.getStatusCode() == HttpStatus.NO_CONTENT) {
                    return ResponseEntity.status(HttpStatus.OK).body("Update Successfully!");
                }
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error!");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Couldn't find user!");
    }

    public ResponseEntity<?> updateStatus(String userId, int status) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {

            UserStatusRequest userStatusRequest = new UserStatusRequest();
            userStatusRequest.setEnabled(status == 1);

            ResponseEntity<?> result = APIUtil.exchange(
                    MediaType.APPLICATION_JSON, UserUtil.getToken(),
                    userUrl.replace("{userId}", userId),
                    HttpMethod.PUT,
                    Object.class, userStatusRequest);
            if (result.getStatusCode() == HttpStatus.NO_CONTENT) {
                return ResponseEntity.status(HttpStatus.OK).body("Update user status successfully!");
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Can't found user by id: " + userId);
    }

    public ResponseEntity<?> getUserById(String userId) {
        Map<String, Object> userDto = userRepository.getUserById(userId);
        if (userDto != null) {
            return ResponseEntity.status(HttpStatus.OK).body(new Response().setData(userDto).setMessage("Successfully!"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Can't found user by id: " + userId);
        }
    }

    public ResponseEntity<?> getUserPublicInfoById(String userId) {
        UserPublicDTO userFinded = userRepository.findUserPublicInfoByUserId(userId);
        if (userFinded != null) {
            return ResponseEntity.status(HttpStatus.OK).body(new Response().setData(userFinded).setMessage("Successfully!"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Can't found user by id: " + userId);
        }
    }
}
