package com.bigbird.tmsrepo.cmmn.config.RabbitConfig;

import com.bigbird.tmsrepo.cmmn.constant.RabbitConstant;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.amqp.support.converter.SimpleMessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableRabbit
public class RabbitConfig {
    @Value("${spring.rabbitmq.host}")
    private String host;

    @Value("${spring.rabbitmq.port}")
    private int port;

    @Value("${spring.rabbitmq.username}")
    private String username;

    @Value("${spring.rabbitmq.password}")
    private String password;

    @Bean
    public Queue authReplyQueue() {
        return new Queue(RabbitConstant.AUTH_REPLY_QUEUE, true);
    }

    @Bean
    public Queue authUserIDReplyQueue() {
        return new Queue(RabbitConstant.AUTH_USERID_REPLY_QUEUE, true);
    }

    // AUTH REQUEST
    @Bean
    public Queue authRequestQueue() {
        return new Queue(RabbitConstant.AUTH_REQUEST_QUEUE, true);
    }

    @Bean
    public DirectExchange authRequestExchange() {
        return new DirectExchange(RabbitConstant.AUTH_REQUEST_EXCHANGE);
    }

    @Bean
    public Binding bindingAuthRequest(DirectExchange authRequestExchange, Queue authRequestQueue) {
        return BindingBuilder.bind(authRequestQueue).to(authRequestExchange).with(RabbitConstant.AUTH_REQUEST_KEY);
    }

    //  AUTH RESPONSE
    @Bean
    public Queue authResponseQueue() {
        return new Queue(RabbitConstant.AUTH_RESPONSE_QUEUE);
    }

    @Bean
    public DirectExchange authResponseExchange() {
        return new DirectExchange(RabbitConstant.AUTH_RESPONSE_EXCHANGE);
    }

    @Bean
    public Binding bindingAuthResponse(DirectExchange authResponseExchange, Queue authResponseQueue) {
        return BindingBuilder.bind(authResponseQueue).to(authResponseExchange).with(RabbitConstant.AUTH_RESPONSE_KEY);
    }

    //  MEMBER ROLE
    @Bean
    public DirectExchange memberRoleDirectExchange() {
        return new DirectExchange(RabbitConstant.MEMBER_ROLE_EXCHANGE);
    }

    @Bean
    public Queue memberRoleResponseQueue() {
        return new Queue(RabbitConstant.MEMBER_ROLE_QUEUE, true);
    }

    @Bean
    public Binding bindingMemberRole(DirectExchange memberRoleDirectExchange, Queue memberRoleResponseQueue) {
        return BindingBuilder.bind(memberRoleResponseQueue)
                .to(memberRoleDirectExchange)
                .with(RabbitConstant.MEMBER_ROLE_KEY);
    }

    //  AUTH USER ID
    @Bean
    public DirectExchange authUserIDExchange() {
        return new DirectExchange(RabbitConstant.AUTH_USERID_EXCHANGE);
    }

    @Bean
    public Queue authUserIDQueue() {
        return new Queue(RabbitConstant.AUTH_USERID_QUEUE);
    }

    @Bean
    public Binding bindingAuthUserID(DirectExchange authUserIDExchange, Queue authUserIDQueue) {
        return BindingBuilder.bind(authUserIDQueue).to(authUserIDExchange).with(RabbitConstant.AUTH_USERID_KEY);
    }

    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(new SimpleMessageConverter());
        rabbitTemplate.setReplyTimeout(RabbitConstant.WAIT_TIME);
        return rabbitTemplate;
    }

    /*Cache connect*/
    @Bean
    public CachingConnectionFactory connectionFactory() {
        CachingConnectionFactory factory = new CachingConnectionFactory(host);
        factory.setPort(port);
        factory.setUsername(username);
        factory.setPassword(password);
        factory.setChannelCacheSize(25);
        return factory;
    }

    @Bean
    public AmqpTemplate template(ConnectionFactory connectionFactory) {
        final RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter());
        return rabbitTemplate;
    }

    // Define RabbitListenerContainerFactory to configure the listeners
    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(ConnectionFactory connectionFactory) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(messageConverter());
        return factory;
    }

    @Bean
    public RabbitAdmin admin(ConnectionFactory connectionFactory) {
        RabbitAdmin rabbitAdmin = new RabbitAdmin(connectionFactory);

//        declareAdmin(rabbitAdmin, RabbitConstant.REPO_EXCHANGE, RabbitConstant.REPO_QUEUE, RabbitConstant.REPO_KEY);

        return rabbitAdmin;
    }

    private void declareAdmin(RabbitAdmin rabbitAdmin, String nameExchange, String nameQueue, String routingKey) {
        var directExchange = new DirectExchange(nameExchange);
        rabbitAdmin.declareExchange(directExchange);
        var queue = new Queue(nameQueue);
        rabbitAdmin.declareQueue(queue);
        var binding = BindingBuilder.bind(queue).to(directExchange).with(routingKey);
        rabbitAdmin.declareBinding(binding);
    }
}