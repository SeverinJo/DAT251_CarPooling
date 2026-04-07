package no.hvl.carpooling.persistence.entity;

import jakarta.persistence.*;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "username")
    String username;

    @Column(name = "email")
    String email;

    @Column(name = "password")
    String hashedPassword;

    public User() {}

    public User(String username, String email, String hashedPassword){
        this.username = username;
        this.email = email;
        this.hashedPassword = hashedPassword;
    }

    public Integer getId(){
        return this.id;
    }
    public String getEmail(){
        return this.email;
    }

    public String getHashedPassword() {
        return hashedPassword;
    }

    public void setHashedPassword(String password) {
        this.hashedPassword = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email){
        this.email = email;
    }

    public void setId(int id) {
        this.id = id;
    }

}
