package com.tms_run.cmmn.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.deser.std.StringDeserializer;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;
import com.tms_run.cmmn.util.ObjectMapperUtil;
import org.springframework.boot.autoconfigure.http.HttpMessageConverters;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Component;

import java.util.HashSet;

@Component
@Configuration
public class ObjectMapperConfig {
    @Bean(name = "json_main")
    @Primary
    public ObjectMapper main() {
        ObjectMapper objectMapper = ObjectMapperUtil.initSimpleObjectMapper();

        SimpleModule module = new SimpleModule();
        module.addDeserializer(String.class, new StringDeserializer());
        SimpleFilterProvider filters = new SimpleFilterProvider();
        filters.addFilter("empty", SimpleBeanPropertyFilter.serializeAllExcept(new HashSet<>()));
        filters.addFilter("field", SimpleBeanPropertyFilter.serializeAllExcept(new HashSet<>()));
        objectMapper.setFilterProvider(filters);
        objectMapper.registerModule(module);

        return objectMapper;
    }

    @Bean(name = "json_simple")
    public ObjectMapper simpleObjectMapper() {
        return ObjectMapperUtil.initSimpleObjectMapper();
    }

    @Bean(name = "converter_main")
    @Primary
    public MappingJackson2HttpMessageConverter converter() {
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setObjectMapper(main());
        return converter;
    }

    @Bean(name = "converters_mains")
    @Primary
    public HttpMessageConverters convertersMain() {
        HttpMessageConverters converters = new HttpMessageConverters(converter());
        return converters;
    }
}
