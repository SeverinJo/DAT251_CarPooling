package no.hvl.carpooling.service.user;

import no.hvl.carpooling.api.auth.CreateUserRequest;
import no.hvl.carpooling.database.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import jakarta.transaction.Transactional;
import no.hvl.carpooling.database.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static jakarta.transaction.Transactional.TxType.REQUIRES_NEW;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(REQUIRES_NEW)
    public User saveUser(User user){
        user.setHashedPassword(passwordEncoder.encode(user.getHashedPassword()));
        return userRepository.save(user);
    }

    @Transactional(REQUIRES_NEW)
    public void saveUser(CreateUserRequest createUserRequest) {
        User user = new User(createUserRequest.username(), createUserRequest.email(), createUserRequest.password());
        user.setHashedPassword(passwordEncoder.encode(user.getHashedPassword()));
        userRepository.save(user);
    }

    @Transactional
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public Optional<User> getUserById(int id) {
        return userRepository.findById(id);
    }

    @Transactional
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Transactional(REQUIRES_NEW)
    public User updateUser(Integer id, User newUserDetails) {
        return userRepository.findById(id).map(currentUser -> {
            currentUser.setUsername(newUserDetails.getUsername());
            currentUser.setEmail(newUserDetails.getEmail());
            return userRepository.save(currentUser);
        }).orElseThrow(() -> new RuntimeException("No found user"));
    }

    @Transactional(REQUIRES_NEW)
    public void deleteUser(Integer id) {
        if(!userRepository.existsById(id)) {
            throw new RuntimeException("No found user");
        }
        userRepository.deleteById(id);
    }

}
