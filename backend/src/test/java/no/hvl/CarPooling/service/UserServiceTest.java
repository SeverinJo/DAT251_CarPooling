package no.hvl.CarPooling.service;

import no.hvl.CarPooling.model.User;
import no.hvl.CarPooling.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void createUserSuccessfully(){
        User user = new User();
        user.setUsername("name");
        user.setEmail("email");
        user.setPassword("password");

        when(userRepository.save(user)).thenReturn(user);
        User saved = userService.createUser(user);

        assertNotNull(saved);
        assertEquals("name", saved.getUsername());
        assertEquals("email", saved.getEmail());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void giveAllUsers(){
        User user1 = new User();
        User user2 = new User();
        user1.setUsername("name1");
        user2.setUsername("name2");
        user1.setEmail("email1");
        user2.setEmail("email2");
        user1.setPassword("password1");
        user2.setPassword("password2");

        when(userRepository.findAll()).thenReturn(Arrays.asList(user1, user2));
        List<User> users = userService.getAllUsers();

        assertEquals(2, users.size());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void giveUserById(){
        User user = new User();
        user.setUsername("name");
        user.setEmail("email");
        user.setPassword("password");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        Optional<User> givenUser = userService.getUserById(1L);

        assertTrue(givenUser.isPresent());
        assertEquals("name", givenUser.get().getUsername());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void updateAUser(){
        User user1 = new User();
        user1.setUsername("name1");
        user1.setEmail("email1");
        user1.setPassword("password1");

        User user2 = new User();
        user2.setUsername("name2");
        user2.setEmail("email2");
        user2.setPassword("password2");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
        when(userRepository.save(user1)).thenReturn(user1);

        User resultingUser = userService.updateUser(1L, user2);

        assertNotNull(resultingUser);
        assertEquals("name2", resultingUser.getUsername());
        assertEquals("email2", resultingUser.getEmail());
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).save(user1);
    }

    @Test
    void hopeItThrowExceptionIfNoFoundUser(){
        User user1 = new User();
        user1.setUsername("name1");
        user1.setEmail("email1");

        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> userService.updateUser(1L, user1));

        assertEquals("No found user", exception.getMessage());
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void deleteUser(){
        when(userRepository.existsById(1L)).thenReturn(true);
        doNothing().when(userRepository).deleteById(1L);

        userService.deleteUser(1L);

        verify(userRepository, times(1)).existsById(1L);
        verify(userRepository, times(1)).deleteById(1L);
    }

    @Test
    void ifNoUserFoundOnDeletePlsThrowException(){
        when(userRepository.existsById(1L)).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> userService.deleteUser(1L));

        assertEquals("No found user", exception.getMessage());
        verify(userRepository, times(1)).existsById(1L);
        verify(userRepository, never()).deleteById(anyLong());
    }
}
