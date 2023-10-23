package pe.edu.vallegrande.app.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.vallegrande.app.model.entity.Teacher;
import pe.edu.vallegrande.app.repository.TeacherRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TeacherService {
    private final TeacherRepository teacherRepository;

    public List<Teacher> findAll() {
        return teacherRepository.findAll();
    }

    @Transactional
    public Teacher save(Teacher teacher) {
        return teacherRepository.save(teacher);
    }

    public Optional<Teacher> findById(Long id) {
        return teacherRepository.findById(id);
    }

    @Transactional
    public Teacher update(Long id, Teacher teacher) {
        // Realizar validaciones y lógica de actualización aquí
    	teacher.setId_teacher(id);
        return teacherRepository.save(teacher);
    }

    @Transactional
    public Optional<Teacher> deactivate(Long id) {
    	teacherRepository.deactivateTeacher(id);
        return teacherRepository.findById(id);
    }

    @Transactional
    public Optional<Teacher> activate(Long id) {
    	teacherRepository.activateTeacher(id);
        return teacherRepository.findById(id);
    }

    @Transactional
    public void delete(Long id) {
    	teacherRepository.deleteTeacher(id);
    }
}

