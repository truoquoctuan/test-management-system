package com.tms_run.cmmn.util;

import com.nimbusds.jose.JWSObject;
import com.nimbusds.jwt.JWTClaimsSet;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import java.text.ParseException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class TokenUtils {
    public static Jwt getJwtFromContext() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof Jwt) {
            return (Jwt) principal;
        }
        return null;
    }

    public static String getUserID() {
        Jwt jwt = getJwtFromContext();
        if (jwt != null) {
            return jwt.getClaimAsString("sub");
        }
        return null;
    }

    public static List<String> getRoleInService() {
        Jwt jwt = getJwtFromContext();
        if (jwt != null) {
            List<String> audiences = jwt.getClaimAsStringList("aud");
            return audiences != null ? audiences : Collections.emptyList();
        }
        return Collections.emptyList();
    }

    public static String getUserRole() {
        Jwt jwt = getJwtFromContext();
        if (jwt != null) {
            String author = "Unauthorized";
            Map<String, Object> resourceAccess = jwt.getClaimAsMap("resource_access");
            for(String key : resourceAccess.keySet()){
                if(key.equalsIgnoreCase("bzq-service")){
                    author = "ROLE_STAFF";
                }
            }
            Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
            List<String> roles = (List<String>) realmAccess.getOrDefault("roles", Collections.emptyList());
            if (!roles.isEmpty()) {
                if (roles.contains("workspace_admin")) {
                    author = "ROLE_ADMIN";
                }
            }
            return author;
        }
        return null;
    }

    public static String extractUserIdFromToken(String token) {
        try {
            JWSObject jwsObject = JWSObject.parse(token);
            JWTClaimsSet claimsSet = JWTClaimsSet.parse(jwsObject.getPayload().toString());
            return claimsSet.getStringClaim("sub");
        } catch (ParseException e) {
            throw new RuntimeException("Invalid token", e);
        }
    }
}
