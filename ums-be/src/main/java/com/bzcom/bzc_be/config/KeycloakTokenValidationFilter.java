package com.bzcom.bzc_be.config;


import jakarta.annotation.PostConstruct;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
public class KeycloakTokenValidationFilter extends OncePerRequestFilter {

    @Value("${keycloak.auth-server-url}")
    private String keycloakAuthServerUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
    private String openIdCertsUrl;

    private static String OPEN_ID_CERTS_URL;

    @PostConstruct
    public void init() {
        OPEN_ID_CERTS_URL = openIdCertsUrl;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = resolveToken(request);

        if (token != null) {
            boolean isValid = validateTokenWithKeycloak(token);

            if (!isValid) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Token invalidated by Keycloak");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private boolean validateTokenWithKeycloak(String token) {
        try {
            String url = keycloakAuthServerUrl + "/realms/" + realm + "/protocol/openid-connect/userinfo";

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "text/plain;charset=utf-8")
                    .header("Authorization", "Bearer ".concat(token))
                    .GET()
                    .build();

            HttpResponse<String> response = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    private Jwt jwtDecoder(String token) {
        JwtDecoder jwtDecoder = NimbusJwtDecoder.withJwkSetUri(OPEN_ID_CERTS_URL).build();
        return jwtDecoder.decode(token);
    }

    public List<String> getRolesInRealm(String token) {
        Map<String, Object> resourceAccess = jwtDecoder(token).getClaimAsMap("resource_access");
        if (resourceAccess != null && resourceAccess.containsKey("realm-management")) {
            Map<String, Object> workSpaceRoles = (Map<String, Object>) resourceAccess.get("realm-management");
            if (workSpaceRoles != null && workSpaceRoles.containsKey("roles")) {
                List<String> workSpaceRole = (List<String>) workSpaceRoles.get("roles");
                if (workSpaceRole != null) return workSpaceRole;
            }
        }
        return Collections.emptyList();
    }
}