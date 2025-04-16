package com.tms_file.cmmn.config.RabbitConfig;

import com.tms_file.cmmn.constant.RabbitConstant;
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

    //  ISSUE CAUSE SOLUTION
    @Bean
    public DirectExchange issuesCauseSolutionExchange() {
        return new DirectExchange(RabbitConstant.ISSUES_CAUSE_SOLUTION_EXCHANGE);
    }

    @Bean
    public Queue issuesCauseSolutionQueue() {
        return new Queue(RabbitConstant.ISSUES_CAUSE_SOLUTION_QUEUE, true);
    }

    @Bean
    public Binding bindingIssuesCauseSolution(DirectExchange issuesCauseSolutionExchange, Queue issuesCauseSolutionQueue) {
        return BindingBuilder.bind(issuesCauseSolutionQueue)
                .to(issuesCauseSolutionExchange)
                .with(RabbitConstant.ISSUES_CAUSE_SOLUTION_KEY);
    }

    //  RUN ISSUE CAUSE SOLUTION
    @Bean
    public DirectExchange runIssuesCauseSolutionExchange() {
        return new DirectExchange(RabbitConstant.RUN_ISSUES_CAUSE_SOLUTION_EXCHANGE);
    }

    @Bean
    public Queue runIssuesCauseSolutionQueue() {
        return new Queue(RabbitConstant.RUN_ISSUES_CAUSE_SOLUTION_QUEUE, true);
    }

    @Bean
    public Binding bindingRunIssuesCauseSolution(DirectExchange runIssuesCauseSolutionExchange, Queue runIssuesCauseSolutionQueue) {
        return BindingBuilder.bind(runIssuesCauseSolutionQueue)
                .to(runIssuesCauseSolutionExchange)
                .with(RabbitConstant.RUN_ISSUES_CAUSE_SOLUTION_KEY);
    }

    // SAVE ISSUE CAUSE SOLUTION
    @Bean
    public DirectExchange saveIssuesCauseSolutionExchange() {
        return new DirectExchange(RabbitConstant.SAVE_ISSUES_CAUSE_SOLUTION_EXCHANGE);
    }

    @Bean
    public Queue saveIssuesCauseSolutionQueue() {
        return new Queue(RabbitConstant.SAVE_ISSUES_CAUSE_SOLUTION_QUEUE, true);
    }

    @Bean
    public Binding bindingSaveIssuesCauseSolution(DirectExchange saveIssuesCauseSolutionExchange, Queue saveIssuesCauseSolutionQueue) {
        return BindingBuilder.bind(saveIssuesCauseSolutionQueue)
                .to(saveIssuesCauseSolutionExchange)
                .with(RabbitConstant.SAVE_ISSUES_CAUSE_SOLUTION_KEY);
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
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
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

//        declareAdmin(rabbitAdmin, RabbitConstant.RUN_EXCHANGE, RabbitConstant.RUN_QUEUE, RabbitConstant.RUN_KEY);

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
