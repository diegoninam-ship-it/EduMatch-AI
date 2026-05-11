package com.edumatch.api.service;

import com.edumatch.api.client.DjangoClient;
import com.edumatch.api.dto.AuthResponse;
import com.edumatch.api.dto.LoginRequest;
import com.edumatch.api.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final DjangoClient djangoClient;
    private final JwtUtil jwtUtil;

    @SuppressWarnings("unchecked")
    public AuthResponse login(LoginRequest request) {
        try {
            Map<String, Object> response = (Map<String, Object>) djangoClient.loginUser(
                    request.getEmail(), request.getPassword()
            );
            Map<String, Object> user = (Map<String, Object>) response.get("user");
            Map<String, Object> role = (Map<String, Object>) user.get("role");

            String email    = (String) user.get("email");
            String userId   = (String) user.get("id");
            String roleName = (String) role.get("name");
            String nombre   = user.get("first_name") + " " + user.get("last_name");

            String token = jwtUtil.generateToken(email, roleName, userId);
            return new AuthResponse(token, userId, nombre, email, roleName);

        } catch (Exception e) {
            throw new BadCredentialsException("Credenciales inválidas");
        }
    }
}
