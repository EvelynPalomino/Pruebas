import { Student } from './../../models/student.model';
import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.services';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit{
    isAgeValid() {
    throw new Error('Method not implemented.');
    }
    calculateAge(arg0: string) {
    throw new Error('Method not implemented.');
    }
    
      Student: Student = new Student();
      StudentForm: any;
      formBuilder: any;
      selectedDocumentType: string = 'DNI';
      // Teacher = {
      //   dateOfBirth: ''
      // };
      invalidDateFormat: boolean = false;
      invalidAge: boolean = false;
    
      // onDateInput(event: any) {
      //   const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
      //   this.invalidDateFormat = !dateRegex.test(this.teacher.dateOfBirth.toString()); // Convierte a cadena para validar el formato
      
      //   if (!this.invalidDateFormat) {
      //     const enteredDate: Date = new Date(this.teacher.dateOfBirth);
      //     const currentDate: Date = new Date();
      
      //     const ageDifference = currentDate.getFullYear() - enteredDate.getFullYear();
      //     this.invalidAge = ageDifference < 25;
      //   } else {
      //     this.invalidAge = false; // Resetear la bandera si la fecha no es válida
      //   }
      // }
      
    
      constructor(
        public StudentService: StudentService,
        public activateRoute: ActivatedRoute,
        public router: Router,
        private location: Location,
        private modalService: NgbModal  // Inyecta NgbModal en el constructor
      ) { }
    
    
      ngOnInit() {
        this.cargarStudent();
      }
    
      cargarStudent(): void {
        this.activateRoute.params.subscribe(params => {
          let id = params['id'];
          if (id) {
            this.StudentService.getStudent(id).subscribe((Student) => this.StudentForm = Student);
          }
        });
      }
    
      create(): void {
        this.Student.state_student = 'A';
    
        this.StudentService.create(this.Student).subscribe(
          createdStudent => {
            Swal.fire({
              title: 'Operacion Exitosa',
              text: `Usuario ${createdStudent.names_student} creado exitosamente!`,
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Ok'
            }).then(() => {
              this.router.navigate(['/Student-a']);
              window.location.reload();
            });
          },
          error => {
            // Muestra mensaje de error si hay un problema
          }
        );
      }
    
    
      update(): void {
        this.StudentService.update(this.StudentForm).subscribe(Student => {
          this.router.navigate(['/Student-a']);
        });
      }
    
    
      // Agrega este método para cerrar el modal usando NgbModal
      closeModal(): void {
        // Puedes cerrar el modal usando el servicio NgbModal
        this.modalService.dismissAll();
      }
}
