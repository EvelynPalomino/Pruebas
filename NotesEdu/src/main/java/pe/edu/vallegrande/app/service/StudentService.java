package pe.edu.vallegrande.app.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.vallegrande.app.model.entity.Student;
import pe.edu.vallegrande.app.repository.StudentRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentService {
    private final StudentRepository studentRepository;

    public List<Student> findAll() {
        return studentRepository.findAll();
    }

    @Transactional
    public Student save(Student student) {
        return studentRepository.save(student);
    }

    public Optional<Student> findById(Long id) {
        return studentRepository.findById(id);
    }

    @Transactional
    public Student update(Long id, Student student) {
        // Realizar validaciones y lógica de actualización aquí
        student.setId_student(id);
        return studentRepository.save(student);
    }

    @Transactional
    public Optional<Student> deactivate(Long id) {
        studentRepository.deactivateStudent(id);
        return studentRepository.findById(id);
    }

    @Transactional
    public Optional<Student> activate(Long id) {
        studentRepository.activateStudent(id);
        return studentRepository.findById(id);
    }

    @Transactional
    public void delete(Long id) {
        studentRepository.deleteStudent(id);
    }
}