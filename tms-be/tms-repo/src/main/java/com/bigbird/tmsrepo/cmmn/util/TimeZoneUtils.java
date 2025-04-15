package com.bigbird.tmsrepo.cmmn.util;

import java.util.HashMap;
import java.util.Map;

public class TimeZoneUtils {

    public static final Map<String, String> timeZoneMap;

    // Static initializer:
    static {
        timeZoneMap = new HashMap<>();
        timeZoneMap.put("ACT", "Australia/Darwin");
        timeZoneMap.put("AET", "Australia/Sydney");
        timeZoneMap.put("AGT", "America/Argentina/Buenos_Aires");
        timeZoneMap.put("ART", "Africa/Cairo");
        timeZoneMap.put("AST", "America/Anchorage");
        timeZoneMap.put("BET", "America/Sao_Paulo");
        timeZoneMap.put("BST", "Asia/Dhaka");
        timeZoneMap.put("CAT", "Africa/Harare");
        timeZoneMap.put("CNT", "America/St_Johns");
        timeZoneMap.put("CST", "America/Chicago");
        timeZoneMap.put("CTT", "Asia/Shanghai");
        timeZoneMap.put("EAT", "Africa/Addis_Ababa");
        timeZoneMap.put("ECT", "Europe/Paris");
        timeZoneMap.put("IET", "America/Indiana/Indianapolis");
        timeZoneMap.put("IST", "Asia/Kolkata");
        timeZoneMap.put("JST", "Asia/Tokyo");
        timeZoneMap.put("MIT", "Pacific/Apia");
        timeZoneMap.put("NET", "Asia/Yerevan");
        timeZoneMap.put("NST", "Pacific/Auckland");
        timeZoneMap.put("PLT", "Asia/Karachi");
        timeZoneMap.put("PNT", "America/Phoenix");
        timeZoneMap.put("PRT", "America/Puerto_Rico");
        timeZoneMap.put("PST", "America/Los_Angeles");
        timeZoneMap.put("SST", "Pacific/Guadalcanal");
        timeZoneMap.put("VST", "Asia/Ho_Chi_Minh");
        timeZoneMap.put("EST", "-05:00");
        timeZoneMap.put("MST", "-07:00");
        timeZoneMap.put("HST", "-10:00");
    }

}

