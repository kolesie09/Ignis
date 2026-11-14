package com.ignis.API.entity; // Tu wpisz swój główny pakiet

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String login;
    private String password;
    private String email;
    private String name;
    @Column(name = "lastname")
    private String lastName;
    private LocalDate dateOfBirth;
    private String nick;

    @Column(name = "active", nullable = false)
    private boolean active;

    protected User() {
    }

    public User(String login, String password, String email, String name, String lastName, LocalDate dateOfBirth, String nick) {
        this.login = login;
        this.password = password;
        this.email = email;
        this.name = name;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.nick = nick;
        this.active = false; // Domyślnie ustawiamy na false
    }

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "roles_id")
    )
    private Set<Role> roles = new HashSet<>();

    public Set<Role> getRoles() {
        return roles;
    }

    public boolean isActive() {
        return active;
    }

    public void activate() {
        this.active = true;
    }

    // Tutaj później wygenerujesz gettery i settery
}
