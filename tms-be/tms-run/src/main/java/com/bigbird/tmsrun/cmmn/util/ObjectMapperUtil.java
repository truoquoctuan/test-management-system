package com.tms_run.cmmn.util;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.SerializationFeature;

public class ObjectMapperUtil {
    public static void configSimpleObjectMapper(ObjectMapper json) {
        json.disable(SerializationFeature.WRAP_ROOT_VALUE);
        json.disable(DeserializationFeature.UNWRAP_ROOT_VALUE);
        json.setPropertyNamingStrategy(PropertyNamingStrategy.SNAKE_CASE);
        json.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        json.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    public static ObjectMapper initSimpleObjectMapper() {
        ObjectMapper json = new ObjectMapper();
        configSimpleObjectMapper(json);

        return json;
    }
}
