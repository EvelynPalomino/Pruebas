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
@Table(name = "student")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_student")
    private Long id_student;

    @Column(name = "names_student")
    private String names_student;

    @Column(name = "last_namestudent")
    private String last_namestudent;

    @Column(name = "type_document")
    private String type_document;

    @Column(name = "number_document")
    private String number_document;

    @Column(name = "state_student")
    private String state_student;

    @Column(name = "grade_id")
    private Integer grade_id;
}
