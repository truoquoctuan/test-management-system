package com.tms_run.cmmn.base;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.google.common.base.CaseFormat;
import org.apache.commons.lang.StringUtils;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Objects;

public class ParamMap extends BaseMap {
    public ParamMap() {
        super();
    }

    public static ParamMap init() {
        ParamMap paramMap = new ParamMap();
//        paramMap.addBasicParameters();

        return paramMap;
    }

    public static ParamMap init(Object object) {
        ObjectMapper mapper = new ObjectMapper();
        JavaTimeModule module = new JavaTimeModule();
        module.addSerializer(LocalDate.class, new LocalDateSerializer(DateTimeFormatter.ISO_DATE));
        mapper.registerModule(module);

        ParamMap paramMap = mapper.convertValue(object, ParamMap.class);
//        paramMap.addBasicParameters();

        return paramMap;
    }

    public static ParamMap init(Object object, Pageable pageable) {
        ParamMap paramMap = Objects.requireNonNull(init(object).put("pageable", pageable)).put("paging", true);
        if (pageable != null && !StringUtils.equals(pageable.getSort().toString(), "UNSORTED")) {
            String sort = pageable.getSort().toString();
            String column = CaseFormat.UPPER_CAMEL.to(CaseFormat.LOWER_UNDERSCORE, StringUtils.substringBefore(sort, ":"));
            if (StringUtils.contains(column, ".")) {
                column = StringUtils.substringBefore(sort, ".") + "." + StringUtils.substringAfter(column, ".");
            }

            Objects.requireNonNull(paramMap).put("orders", String.format("%s %s", column, StringUtils.substringAfter(sort, ":").toLowerCase()));
        }
        return paramMap;
    }

    @Override
    public ParamMap put(String key, Object value) {
        super.put(key, value);
        return this;
    }
}

