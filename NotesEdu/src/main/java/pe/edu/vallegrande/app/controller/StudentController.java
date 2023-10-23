package pe.edu.vallegrande.app.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.vallegrande.app.model.entity.Student;
import pe.edu.vallegrande.app.service.StudentService;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/v1/students")
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    public ResponseEntity<List<Student>> findAll() {
        List<Student> students = studentService.findAll();
        return ResponseEntity.ok(students);
    }

    @PostMapping
    public ResponseEntity<Student> save(@RequestBody Student student) {
        Student savedStudent = studentService.save(student);
        return ResponseEntity.ok(savedStudent);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Student>> findById(@PathVariable Long id) {
        Optional<Student> student = studentService.findById(id);
        return ResponseEntity.ok(student);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updatePartial(@PathVariable Long id, @RequestBody Student updatedStudent) {
        Optional<Student> existingStudentOptional = studentService.findById(id);

        if (existingStudentOptional.isEmpty()) {
            // Manejar el caso en que el registro no existe
            return ResponseEntity.notFound().build();
        }

        Student existingStudent = existingStudentOptional.get();

        // Actualiza solo los campos que se proporcionan en la solicitud JSON
        if (updatedStudent.getNames_student() != null) {
            existingStudent.setNames_student(updatedStudent.getNames_student());
        }

        if (updatedStudent.getLast_namestudent() != null) {
            existingStudent.setLast_namestudent(updatedStudent.getLast_namestudent());
        }

        if (updatedStudent.getType_document() != null) {
            existingStudent.setType_document(updatedStudent.getType_document());
        }

        if (updatedStudent.getNumber_document() != null) {
            existingStudent.setNumber_document(updatedStudent.getNumber_document());
        }

        if (updatedStudent.getGrade_id() != null) {
            existingStudent.setGrade_id(updatedStudent.getGrade_id());
        }

        // Llama al servicio para guardar la actualización parcial
        Student savedStudent = studentService.update(id, existingStudent);

        return ResponseEntity.ok(savedStudent);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        studentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/deactivate/{id}")
    public ResponseEntity<Optional<Student>> deactivate(@PathVariable Long id) {
        Optional<Student> deactivatedStudent = studentService.deactivate(id);
        return ResponseEntity.ok(deactivatedStudent);
    }

    @PutMapping("/activate/{id}")
    public ResponseEntity<Optional<Student>> activate(@PathVariable Long id) {
        Optional<Student> activatedStudent = studentService.activate(id);
        return ResponseEntity.ok(activatedStudent);
    }
}