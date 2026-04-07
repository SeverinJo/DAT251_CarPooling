package no.hvl.carpooling.api.auth;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import no.hvl.carpooling.database.entity.User;
import no.hvl.carpooling.security.JwtFactory;
import no.hvl.carpooling.service.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    private final JwtFactory jwtFactory;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    public AuthController(
        JwtFactory jwtFactory,
        PasswordEncoder passwordEncoder,
        UserService userService
    ) {
        this.jwtFactory = jwtFactory;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
    }

    @PostMapping("/login")
    @Transactional
    public ResponseEntity<?> login(@RequestParam String username, @RequestParam String password) {
        var userOpt = userService.findByUsername(username);

        if (userOpt.isEmpty()) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Invalid username or password");
        }

        var user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getHashedPassword())) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Invalid username or password");
        }

        String token = jwtFactory.generateToken(username);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/register")
    public ResponseEntity<User> createUser(@Valid @RequestBody User user){
        User createdUser = userService.saveUser(user);

        // todo: return an user DTO without password hash (high vulnerability)
//        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}