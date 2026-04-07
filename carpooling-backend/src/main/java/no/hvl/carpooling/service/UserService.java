package no.hvl.carpooling.service;

import no.hvl.carpooling.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import jakarta.transaction.Transactional;
import no.hvl.carpooling.persistence.entity.User;
import no.hvl.carpooling.persistence.repository.UserRepository;
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
    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(value = REQUIRES_NEW)
    public User saveUser(User user){
        return userRepository.save(user);
    }

    @Transactional
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    @Transactional
    public Optional<User> getUserById(int id){
        return userRepository.findById(id);
    }

    @Transactional(value = REQUIRES_NEW)
    public User updateUser(Integer id, User newUserDetails){
        return userRepository.findById(id).map(currentUser -> {
            currentUser.setUsername(newUserDetails.getUsername());
            currentUser.setEmail(newUserDetails.getEmail());
            return userRepository.save(currentUser);
        }).orElseThrow(() -> new RuntimeException("No found user"));
    }

    @Transactional(value = REQUIRES_NEW)
    public void deleteUser(Integer id){
        if(!userRepository.existsById(id)){
            throw new RuntimeException("No found user");
        }
        userRepository.deleteById(id);
    }

}
