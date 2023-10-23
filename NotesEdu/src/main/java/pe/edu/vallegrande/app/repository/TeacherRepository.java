package pe.edu.vallegrande.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import pe.edu.vallegrande.app.model.entity.Teacher;

import java.util.List;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    @Modifying
    @Query(value = "update Teacher s set s.state_teacher = 'I' where s.id_teacher = ?1")
    void deactivateTeacher(Long id);

    @Modifying
    @Query(value = "update Teacher s set s.state_teacher = 'A' where s.id_teacher = ?1")
    void activateTeacher(Long id);

    @Modifying
    @Query(value = "delete from Teacher s where s.id_teacher = ?1")
    void deleteTeacher(Long id);
}
