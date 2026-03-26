package no.hvl.carpooling.service;

import no.hvl.carpooling.model.User;
import no.hvl.carpooling.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public User createUser(User user){
        return userRepository.save(user);
    }

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id){
        return userRepository.findById(id);
    }

    public User updateUser(Long id, User newUserDetails){
        return userRepository.findById(id).map(currentUser -> {
            currentUser.setUsername(newUserDetails.getUsername());
            currentUser.setEmail(newUserDetails.getEmail());
            return userRepository.save(currentUser);
        }).orElseThrow(() -> new RuntimeException("No found user"));
    }

    public void deleteUser(Long id){
        if(!userRepository.existsById(id)){
            throw new RuntimeException("No found user");
        }
        userRepository.deleteById(id);
    }
}
