package com.bzcom.bzc_be.cmmn.util;

import com.bzcom.bzc_be.config.KeycloakTokenValidationFilter;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.List;

public class UserUtil {

    private UserUtil() {}

    public static String getToken() {
        HttpServletRequest request =
                ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String authorizationHeader = request.getHeader("Authorization");
        return authorizationHeader.substring(7);
    }

    public static boolean checkRealmManagerRole() {
        boolean isRealmManagerRole = false;
        List<String> realmRoles = new KeycloakTokenValidationFilter().getRolesInRealm(getToken());
        if (realmRoles.contains("manage-users")) isRealmManagerRole = true;
        return isRealmManagerRole;
    }
}
