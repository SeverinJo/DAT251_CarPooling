package no.hvl.carpooling.controller;

import no.hvl.carpooling.api.controllers.UserController;
import no.hvl.carpooling.persistence.entity.User;
import no.hvl.carpooling.service.UserService;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void createUserSuccessfully() throws Exception{
        User user = new User();
        user.setId(1);
        user.setUsername("name");
        user.setEmail("email");
        user.setHashedPassword("password");

        when(userService.saveUser(any(User.class))).thenReturn(user);

        mockMvc.perform(post("/users").content(objectMapper.writeValueAsString(user)).contentType(MediaType.APPLICATION_JSON)).andExpect(status().isCreated()).andExpect(jsonPath("$.id").value(1)).andExpect(jsonPath("$.username").value("name")).andExpect(jsonPath("$.email").value("email"));
    }

    @Test
    void createUserUnsuccessfully() throws Exception{
        User user = new User();
        user.setUsername("");
        user.setEmail("");
        user.setHashedPassword("");

        mockMvc.perform(post("/users").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(user))).andExpect(status().isBadRequest());
    }

    @Test
    void getUserSuccessfully() throws Exception{
        User user = new User();
        user.setId(1);
        user.setUsername("name");
        user.setEmail("email");
        user.setHashedPassword("password");

        when(userService.getUserById(1)).thenReturn(Optional.of(user));

        mockMvc.perform(get("/users/1")).andExpect(status().isOk()).andExpect(jsonPath("$.id").value(1)).andExpect(jsonPath("$.username").value("name")).andExpect(jsonPath("$.email").value("email"));
    }

    @Test
    void getUserUnsuccessfully() throws Exception{
        when(userService.getUserById(1)).thenReturn(Optional.empty());

        mockMvc.perform(get("/users/1")).andExpect(status().isNotFound());
    }

    @Test
    void getAllUsersSuccessfully() throws Exception {
        User user = new User();
        user.setId(1);
        user.setUsername("name");
        user.setEmail("email");
        user.setHashedPassword("password");

        User user2 = new User();
        user2.setId(2);
        user2.setUsername("name2");
        user2.setEmail("email2");
        user2.setHashedPassword("password2");

        when(userService.getAllUsers()).thenReturn(List.of(user, user2));

        mockMvc.perform(get("/users")).andExpect(status().isOk()).andExpect(jsonPath("$[0].id").value(1)).andExpect(jsonPath("$[0].username").value("name")).andExpect(jsonPath("$[0].email").value("email")).andExpect(jsonPath("$[1].id").value(2)).andExpect(jsonPath("$[1].username").value("name2")).andExpect(jsonPath("$[1].email").value("email2"));
    }

    @Test
    void updateUserSuccessfully() throws Exception {
        User user = new User();
        user.setId(1);
        user.setUsername("name");
        user.setEmail("email");
        user.setHashedPassword("password");

        when(userService.updateUser(any(Integer.class), any(User.class))).thenReturn(user);

        mockMvc.perform(put("/users/1").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(user))).andExpect(status().isOk()).andExpect(jsonPath("$.id").value(1)).andExpect(jsonPath("$.username").value("name")).andExpect(jsonPath("$.email").value("email"));
    }

    @Test
    void deleteUserSuccessfully() throws Exception{
        doNothing().when(userService).deleteUser(1);

        mockMvc.perform(delete("/users/1")).andExpect(status().isNoContent());
    }
}
