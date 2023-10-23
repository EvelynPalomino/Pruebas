package pe.edu.vallegrande.app.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "teacher")
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_teacher")
    private Long id_teacher;

    @Column(name = "name_teacher")
    private String name_teacher;

    @Column(name = "last_nameteacher")
    private String last_nameteacher;

    @Column(name = "user_teacher")
    private String user_teacher;

    @Column(name = "password_teacher")
    private String password_teacher;

    @Column(name = "state_teacher")
    private String state_teacher;

}
