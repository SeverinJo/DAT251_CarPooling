package no.hvl.carpooling.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "user_table")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank
    String username;
    @NotBlank
    String email;
    @NotBlank
    String password;
    public User(String username, String email, String password){
        this.username = username;
        this.email = email;
        this.password = password;
    }
    public User(){}

    public Long getId(){
        return this.id;
    }
    public String getEmail(){
        return this.email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public void setId(long id) {
        this.id = id;
    }
}
