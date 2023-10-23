package pe.edu.vallegrande.app.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.vallegrande.app.model.entity.Teacher;
import pe.edu.vallegrande.app.service.TeacherService;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/teachers")
public class TeacherController {

    private final TeacherService teacherService;

    @GetMapping
    public ResponseEntity<List<Teacher>> findAll() {
        List<Teacher> students = teacherService.findAll();
        return ResponseEntity.ok(students);
    }

    @PostMapping
    public ResponseEntity<Teacher> save(@RequestBody Teacher student) {
    	Teacher savedStudent = teacherService.save(student);
        return ResponseEntity.ok(savedStudent);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Teacher>> findById(@PathVariable Long id) {
        Optional<Teacher> student = teacherService.findById(id);
        return ResponseEntity.ok(student);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Teacher> updatePartial(@PathVariable Long id, @RequestBody Teacher updatedTeacher) {
        Optional<Teacher> existingTeacherOptional = teacherService.findById(id);

        if (existingTeacherOptional.isEmpty()) {
            // Manejar el caso en que el registro no existe
            return ResponseEntity.notFound().build();
        }

        Teacher existingTeacher = existingTeacherOptional.get();
        
        // Actualiza solo los campos que se proporcionan en la solicitud JSON
        if (updatedTeacher.getName_teacher() != null) {
        	existingTeacher.setName_teacher(updatedTeacher.getName_teacher());
        }
        
        if (updatedTeacher.getLast_nameteacher() != null) {
        	existingTeacher.setLast_nameteacher(updatedTeacher.getLast_nameteacher());
        }

        if (updatedTeacher.getUser_teacher() != null) {
        	existingTeacher.setUser_teacher(updatedTeacher.getUser_teacher());
        }

        if (updatedTeacher.getState_teacher() != null) {
        	existingTeacher.setState_teacher(updatedTeacher.getState_teacher());
        }

        // Llama al servicio para guardar la actualización parcial
        Teacher savedTeacher = teacherService.update(id, existingTeacher);

        return ResponseEntity.ok(savedTeacher);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
    	teacherService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/deactivate/{id}")
    public ResponseEntity<Optional<Teacher>> deactivate(@PathVariable Long id) {
        Optional<Teacher> deactivatedTeacher = teacherService.deactivate(id);
        return ResponseEntity.ok(deactivatedTeacher);
    }

    @PutMapping("/activate/{id}")
    public ResponseEntity<Optional<Teacher>> activate(@PathVariable Long id) {
        Optional<Teacher> activatedTeacher = teacherService.activate(id);
        return ResponseEntity.ok(activatedTeacher);
    }
}
