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
export class StudentFormComponent implements OnInit {
  isAgeValid() {
    throw new Error('Method not implemented.');
  }
  calculateAge(arg0: string) {
    throw new Error('Method not implemented.');
  }
  documentError: boolean = false;
  documentErrorMessage: string = '';

  Student: Student = new Student();
  StudentForm: any;
  formBuilder: any;
  selectedDocumentType: string = 'DNI';

  invalidDateFormat: boolean = false;
  invalidAge: boolean = false;



  constructor(
    public StudentService: StudentService,
    public activateRoute: ActivatedRoute,
    public router: Router,
    private location: Location,
    private modalService: NgbModal  // Inyecta NgbModal en el constructor
  ) { }

  onTypeDocumentChange() {
    this.validateDocument();
  }

  validateDocument() {
    const documentTypeId = this.Student.documentTypeId;
    const documentValue = this.Student.numberDocument;


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



  isValidDocumentLength: boolean = true;

  validateDocumentLength() {
    if ((this.Student.documentTypeId === 1 && this.Student.numberDocument.length === 8) ||
      (this.Student.documentTypeId === 2 && this.Student.numberDocument.length === 12)) {
      this.isValidDocumentLength = true;
    } else {
      this.isValidDocumentLength = false;
    }
  }

  isValidNumberDocument() {
    return /^\d+$/.test(this.Student.numberDocument);
  }

  

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
    this.Student.state = 'A';

    this.StudentService.create(this.Student).subscribe(
      createdStudent => {
        Swal.fire({
          title: 'Operacion Exitosa',
          text: `Usuario ${createdStudent.names} !`,
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
