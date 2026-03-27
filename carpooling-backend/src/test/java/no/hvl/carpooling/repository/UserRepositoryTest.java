package no.hvl.carpooling.repository;

import no.hvl.carpooling.model.User;
import org.flywaydb.core.internal.jdbc.JdbcTemplate;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.junit.jupiter.api.Test;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Import(RepositoryTestcontainersConfiguration.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class UserRepositoryTest {

    @Autowired
    private javax.sql.DataSource dataSource;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Autowired
    private UserRepository userRepository;

    private User user;
    private User saved;

    @Test
    void debugTables() {
        System.out.println(
                jdbcTemplate.queryForList("""
            select table_schema, table_name
            from information_schema.tables
            where table_schema = 'public'
            order by table_name
        """)
        );
    }

    @Test
    void debugDatasource() throws Exception {
        try (var conn = dataSource.getConnection()) {
            System.out.println("URL = " + conn.getMetaData().getURL());
            System.out.println("Schema = " + conn.getSchema());
        }
        System.out.println("Tables = " +
                jdbcTemplate.queryForList(
                        "select table_schema, table_name from information_schema.tables where table_name = 'user_table'"
                )
        );
    }

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
        Long id = saved.getId();
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
