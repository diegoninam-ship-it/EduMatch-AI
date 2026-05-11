package com.edumatch.api.client;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class DjangoClient {

    private final RestTemplate restTemplate;

    @Value("${django.base-url}")
    private String baseUrl;

    public Object loginUser(String email, String password) {
        Map<String, String> body = Map.of("email", email, "password", password);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return restTemplate.postForObject(
                baseUrl + "/api/v1/auth/login/",
                new HttpEntity<>(body, headers),
                Object.class
        );
    }
}
