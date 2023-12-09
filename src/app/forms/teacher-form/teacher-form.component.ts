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
  documentError: boolean = false;
  documentErrorMessage: string = '';

  teacher: Teacher = new Teacher();
  TeacherForm: any;
  formBuilder: any;
  selectedDocumentType: string = 'DNI';
  Teacher = {
    dateOfBirth: ''
  };
  invalidDateFormat: boolean = false;
  invalidAge: boolean = false;




  constructor(
    public teacherServices: TeacherServices,
    public activateRoute: ActivatedRoute,
    public router: Router,
    private location: Location,
    private modalService: NgbModal  // Inyecta NgbModal en el constructor
  ) { }

  onTypeDocumentChange() {
    this.validateDocument();
  }

  validateDocument() {
    const documentTypeId = this.teacher.documentTypeId;
    const documentValue = this.teacher.documentNumber;


    if (documentTypeId === 2) {
      console.log(documentTypeId);
      this.documentError = documentValue.length !== 12 || !/^\d{10}$/.test(documentValue);
      this.documentErrorMessage = 'El número de documento debe tener 10 dígitos.';
    } else if (documentTypeId === 1) {
      console.log(documentTypeId);
      this.documentError = documentValue.length !== 8 || !/^\d{8}$/.test(documentValue);
      this.documentErrorMessage = 'El número de documento debe tener 8 dígitos.';
    } else {
      // Puedes agregar lógica para otros tipos de documentos si es necesario
      this.documentError = false;
      this.documentErrorMessage = '';
    }
  }


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
