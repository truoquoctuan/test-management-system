package com.tms_statistic.socket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;


/**
 * WebSocketMessageBroker
 */

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(final MessageBrokerRegistry registry) {
        //Đặt địa điểm đường dẫn mà broker gửi lên để đăng ký với SockJS:
        registry.enableSimpleBroker("/topic");

        //Đặt địa điểm đường dẫn cho @MessageMapping để FE nhận biết và trả về:
        registry.setApplicationDestinationPrefixes("/ws");
    }

    @Override
    public void registerStompEndpoints(final StompEndpointRegistry registry) {
        registry.addEndpoint("/api/our-websocket")
                .setHandshakeHandler(new UserHandshakeHandler()).setAllowedOriginPatterns("*")
                .withSockJS();
    }

}

/*
Phương thức configureMessageBroker() được sử dụng để cấu hình MessageBrokerRegistry, cho biết địa chỉ mà các message sẽ được gửi đến và nhận từ đâu.
Cho phép các tin nhắn được gửi đến tất cả các khách hàng đang đăng ký với địa chỉ "/topic".
Các tin nhắn được gửi từ khách hàng đến máy chủ sẽ được định tuyến theo đường dẫn "/ws".
*/


/*
Phương thức registerStompEndpoints() được sử dụng để đăng ký một endpoint của WebSocket, để máy khách có thể kết nối đến.
Ở đây, chúng ta đăng ký một endpoint tên là "/our-websocket", và cũng đặt cấu hình cho SockJS.
SockJS là một thư viện JavaScript cho phép sử dụng WebSocket bất kể trình duyệt của người dùng hỗ trợ hay không.
Để xử lý yêu cầu handshake từ khách hàng, chúng ta sử dụng UserHandshakeHandler() để xác thực khách hàng và cấp quyền truy cập cho họ.
*/
