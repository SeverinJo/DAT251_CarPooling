package no.hvl.carpooling.repository;

import no.hvl.carpooling.TestcontainersConfiguration;
import no.hvl.carpooling.database.entity.User;
import no.hvl.carpooling.database.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    private User user;
    private User saved;

    @BeforeEach
    void setUp(){
        userRepository.deleteAll();
        userRepository.flush();

        user = new User("name", "email", "password");
        saved = userRepository.save(user);
    }

    @Test
    void saveUserToRepository(){
        assertNotNull(saved.getId());
        assertEquals("name", saved.getUsername());
    }

    @Test
    void findUserById(){
        var id = saved.getId();
        Optional<User> user = userRepository.findById(id);
        assertTrue(user.isPresent());
        assertEquals("name", user.get().getUsername());
    }

    @Test
    void findUserByEmail(){
        Optional<User> user = userRepository.findByEmail("email");
        assertTrue(user.isPresent());
        assertEquals("name", user.get().getUsername());
    }

    @Test
    void returnEmptyWhenNoFoundUser(){
        Optional<User> user = userRepository.findByEmail("nonexistemail");
        assertFalse(user.isPresent());
    }

    @Test
    void getAllUsers(){
        User user2 = new User("name2", "email2", "password2");
        User saved2 = userRepository.save(user2);

        List<User> users = userRepository.findAll();
        assertEquals(2, users.size());
    }

    @Test
    void updateUser(){
        saved.setUsername("newname");
        saved.setEmail("newemail");

        User updateUser = userRepository.save(saved);
        assertEquals("newname", updateUser.getUsername());
        assertEquals("newemail", updateUser.getEmail());
    }

    @Test
    void deleteUser(){
        userRepository.deleteById(saved.getId());
        Optional<User> deletedUser = userRepository.findById(saved.getId());
        assertFalse(deletedUser.isPresent());
    }
}
