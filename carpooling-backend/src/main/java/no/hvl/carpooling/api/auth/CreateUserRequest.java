package no.hvl.carpooling.api.auth;

import jakarta.validation.constraints.NotBlank;

public record CreateUserRequest(
        @NotBlank(message = "Cannot create user without username")
        String username,
        @NotBlank(message = "Cannot create user without email")
        String email,
        @NotBlank(message = "Cannot create user without password")
        String password
) { }
