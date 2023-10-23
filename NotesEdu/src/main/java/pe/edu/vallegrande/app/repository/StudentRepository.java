package pe.edu.vallegrande.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import pe.edu.vallegrande.app.model.entity.Student;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {

    @Modifying
    @Query(value = "update Student s set s.state_student = 'I' where s.id_student = ?1")
    void deactivateStudent(Long id);

    @Modifying
    @Query(value = "update Student s set s.state_student = 'A' where s.id_student = ?1")
    void activateStudent(Long id);

    @Modifying
    @Query(value = "delete from Student s where s.id_student = ?1")
    void deleteStudent(Long id);
}