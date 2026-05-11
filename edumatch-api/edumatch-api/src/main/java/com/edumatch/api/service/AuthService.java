package com.edumatch.api.service;

import com.edumatch.api.dto.AuthResponse;
import com.edumatch.api.dto.LoginRequest;
import com.edumatch.api.dto.RegisterRequest;
import com.edumatch.api.entity.Rol;
import com.edumatch.api.entity.Usuario;
import com.edumatch.api.exception.BadRequestException;
import com.edumatch.api.exception.ResourceNotFoundException;
import com.edumatch.api.repository.RolRepository;
import com.edumatch.api.repository.UsuarioRepository;
import com.edumatch.api.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("El email ya está registrado");
        }

        Rol rol = rolRepository.findByNombre(request.getRol().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado: " + request.getRol()));

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(rol);
        usuario.setEstado(true);

        usuarioRepository.save(usuario);

        UserDetails userDetails = userDetailsService.loadUserByUsername(usuario.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return new AuthResponse(token, usuario.getIdUsuario(), usuario.getNombre(),
                usuario.getEmail(), rol.getNombre());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(usuario.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return new AuthResponse(token, usuario.getIdUsuario(), usuario.getNombre(),
                usuario.getEmail(), usuario.getRol().getNombre());
    }
}
