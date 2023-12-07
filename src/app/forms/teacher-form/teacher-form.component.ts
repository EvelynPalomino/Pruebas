import { Component, OnInit } from '@angular/core';
import { Teacher } from '../../models/teacher.model';
import { TeacherServices } from 'src/app/services/teacher.services';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.css']
})
export class TeacherFormComponent implements OnInit {
isAgeValid() {
throw new Error('Method not implemented.');
}
calculateAge(arg0: string) {
throw new Error('Method not implemented.');
}

  teacher: Teacher = new Teacher();
  TeacherForm: any;
  formBuilder: any;
  selectedDocumentType: string = 'DNI';
  Teacher = {
    dateOfBirth: ''
  };
  invalidDateFormat: boolean = false;
  invalidAge: boolean = false;

  onDateInput(event: any) {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
    this.invalidDateFormat = !dateRegex.test(this.teacher.dateOfBirth.toString()); // Convierte a cadena para validar el formato
  
    if (!this.invalidDateFormat) {
      const enteredDate: Date = new Date(this.teacher.dateOfBirth);
      const currentDate: Date = new Date();
  
      const ageDifference = currentDate.getFullYear() - enteredDate.getFullYear();
      this.invalidAge = ageDifference < 25;
    } else {
      this.invalidAge = false; // Resetear la bandera si la fecha no es válida
    }
  }
  

  constructor(
    public teacherServices: TeacherServices,
    public activateRoute: ActivatedRoute,
    public router: Router,
    private location: Location,
    private modalService: NgbModal  // Inyecta NgbModal en el constructor
  ) { }


  ngOnInit() {
    this.cargarTeacher();
  }

  cargarTeacher(): void {
    this.activateRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.teacherServices.getTeacher(id).subscribe((teacher) => this.teacher = teacher);
      }
    });
  }

  create(): void {
    this.teacher.stateTeacher = 'A';

    this.teacherServices.create(this.teacher).subscribe(
      (teacher) => {
        // Abre un modal (SweetAlert2) después de crear exitosamente
        Swal.fire({
          title: 'Operacion Exitosa',
          text: `Usuario ${teacher.nameTeacher} !`,
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok'
        }).then(() => {
          // Redirige a la página principal de profesores después de cerrar el modal
          this.router.navigate(['/Teacher']);
          // Recarga la página
          window.location.reload();
        });
      },
      (error) => {
        // Muestra mensaje de error si hay un problema
        Swal.fire('Error', 'Completa los campos y verifica si estan correctos', 'error');
      }
    );
  }


  update(): void {
    this.teacherServices.update(this.teacher).subscribe(teacher => {
      this.router.navigate(['/Teacher']);
    });
  }


  // Agrega este método para cerrar el modal usando NgbModal
  closeModal(): void {
    // Puedes cerrar el modal usando el servicio NgbModal
    this.modalService.dismissAll();
  }
}
