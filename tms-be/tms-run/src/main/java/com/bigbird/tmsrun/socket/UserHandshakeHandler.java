package com.tms_run.socket;

import com.sun.security.auth.UserPrincipal;
import com.tms_run.cmmn.util.TokenUtils;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.util.MultiValueMap;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import org.springframework.web.util.UriComponentsBuilder;

import java.security.Principal;
import java.util.Map;


public class UserHandshakeHandler extends DefaultHandshakeHandler {

    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
        MultiValueMap<String, String> queryParams = UriComponentsBuilder.fromUri(request.getURI()).build().getQueryParams();
        String userId = queryParams.getFirst("userId");
        String token = queryParams.getFirst("token");
        if (userId.equals(TokenUtils.extractUserIdFromToken(token))) {
            return new UserPrincipal(userId);
        } else {
            throw new IllegalArgumentException("Invalid token");
        }
    }


}

/*
DefaultHandshakeHandler là một class Spring được sử dụng để xác định các thông tin cần thiết cho một WebSocket handshake.
Trong trường hợp này, UserHandshakeHandler kế thừa từ DefaultHandshakeHandler và ghi đè phương thức determineUser() để xác định người dùng.

Phương thức determineUser() được gọi khi một WebSocket handshake được thực hiện. Nó tạo một ID ngẫu nhiên sử dụng UUID.randomUUID().toString(),
lưu ID đó vào log với thông báo "User with ID '{id}' opened the page" và trả về một UserPrincipal với ID đó.

UserPrincipal là một class của Java, được sử dụng để đại diện cho người dùng, được xác định bằng tên đăng nhập.
Trong trường hợp này, UserPrincipal được sử dụng để đại diện cho người dùng được xác định bằng một ID ngẫu nhiên.
*/



