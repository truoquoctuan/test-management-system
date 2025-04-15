package com.tms_run.cmmn.base;


import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang.StringUtils;

import java.util.HashMap;

public class BaseMap extends HashMap<String, Object> {
    public String getString(String key) {
        return MapUtils.getString(this, key);
    }

    public int getIntValue(String key) {
        return MapUtils.getIntValue(this, key);
    }

    public Integer getInteger(String key) {
        return MapUtils.getInteger(this, key);
    }

    public Boolean getBoolean(String key) {
        return MapUtils.getBoolean(this, key);
    }

    public boolean getBooleanValue(String key) {
        return MapUtils.getBooleanValue(this, key);
    }

    public Double getDouble(String key) {
        return MapUtils.getDouble(this, key);
    }

    public double getDoubleValue(String key) {
        return MapUtils.getDoubleValue(this, key);
    }

    public Long getLong(String key) {
        return MapUtils.getLong(this, key);
    }

    public long getLongValue(String key) {
        return MapUtils.getLongValue(this, key);
    }

    public Object getObject(String key) {
        return MapUtils.getObject(this, key);
    }

    protected String toCamelCase(String str) {
        StringBuilder camelCaseString = new StringBuilder(str);

        if (StringUtils.isNotEmpty(str)) {
            String[] parts = StringUtils.split(str, "_");
            camelCaseString.setLength(0);
            for (int i = 0; i < parts.length; i++) {
                if (i == 0) {
                    camelCaseString.append(parts[i]);
                } else {
                    camelCaseString.append(StringUtils.capitalize(parts[i]));
                }
            }
        }
        return camelCaseString.toString();
    }

}

