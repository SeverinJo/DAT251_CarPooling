package no.hvl.carpooling.model;

import no.hvl.carpooling.database.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class UserModelTest {

    private User user;
    private User fullUser;
    private final String name = "name";
    private final String email = "email";
    private final String password = "password";

    @BeforeEach
    void setUp(){
        user = new User();
        fullUser = new User(name, email, password);
    }

    @Test
    void canCreateUserObject(){
        assertNotNull(user);
    }

    @Test
    void canCreateUserWithSetNameAndEmailAndPassword(){
        assertNotNull(fullUser);
    }

    @Test
    void canRetrieveCorrectNameFromUser(){
        String gettedUserName = fullUser.getUsername();
        assertEquals(gettedUserName, name);
    }

    @Test
    void canRetrieveCorrectPasswordFromUser(){
        String gettedUserPassword = fullUser.getHashedPassword();
        assertEquals(gettedUserPassword, password);
    }
    @Test
    void canRetrieveCorrectEmailFromUser(){
        String gettedUserEmail = fullUser.getEmail();
        assertEquals(gettedUserEmail, email);
    }

    @Test
    void canGiveUserNameToUser(){
        String newName = "newName";
        user.setUsername(newName);
        assertEquals(newName, user.getUsername());
    }

    @Test
    void canGiveEmailToUser(){
        String newEmail = "newEmail";
        user.setEmail(newEmail);
        assertEquals(newEmail, user.getEmail());
    }
    @Test
    void canGivePasswordToUser(){
        String newPassword = "newPassword";
        user.setHashedPassword(newPassword);
        assertEquals(newPassword, user.getHashedPassword());
    }
}
