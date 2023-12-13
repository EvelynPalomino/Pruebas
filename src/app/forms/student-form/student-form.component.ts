import { Component, OnInit } from '@angular/core';
import { Student } from './../../models/student.model';
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
  // Declaración de variables
  documentError: boolean = false;
  documentErrorMessage: string = '';
  Student: Student = new Student();

  constructor(
    public studentService: StudentService,
    public activateRoute: ActivatedRoute,
    public router: Router,
    private location: Location,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.loadStudent();
  }

  loadStudent(): void {
    this.activateRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.studentService.getStudent(id).subscribe((student) => this.Student = student);
      }
    });
  }

  create(): void {
    // Aquí puedes validar antes de crear el estudiante
    // Por ejemplo, si la longitud del documento es correcta, etc.
    this.Student.state = 'A';

    this.studentService.create(this.Student).subscribe(
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
        // Manejo de errores
      }
    );
  }

  update(): void {
    this.studentService.update(this.Student).subscribe(() => {
      this.router.navigate(['/Student-a']);
    });
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  // Método para obtener el patrón del documento
  getDocumentPattern(): string {
    const documentType = this.Student.documentTypeId;

    switch (documentType) {
      case 1:
        return '\\d{8}'; // 8 dígitos para el tipo 1 (ejemplo: DNI)
      case 2:
        return '\\d{12}'; // 12 dígitos para el tipo 2 (ejemplo: CNE)
      default:
        return ''; // Puedes ajustar este retorno si hay más tipos de documentos
    }
  }

  validateNumericCharacters() {
    const numericRegex = /^[0-9]+$/;
    this.nonNumericCharacters = !numericRegex.test(this.Student.numberDocument);
}

nonNumericCharacters: boolean = false;



  // Método para limpiar errores del documento
  clearDocumentError() {
    this.documentError = false;
    this.documentErrorMessage = '';
  }

  onTypeDocumentChange() {
    this.validateDocumentLength();
    this.clearDocumentError(); // Limpia el error al cambiar el tipo de documento
  }
  validateDocument() {
    const documentTypeId = this.Student.documentTypeId;
    const documentValue = this.Student.numberDocument;
  
    if (documentTypeId === 2) {
      this.documentError = documentValue.length !== 12 || !/^\d{12}$/.test(documentValue);
      this.documentErrorMessage = 'El número de documento debe tener 12 dígitos para el tipo 2 (CNE).';
    } else if (documentTypeId === 1) {
      this.documentError = documentValue.length !== 8 || !/^\d{8}$/.test(documentValue);
      this.documentErrorMessage = 'El número de documento debe tener 8 dígitos para el tipo 1 (DNI).';
    } else {
      // Puedes agregar lógica para otros tipos de documentos si es necesario
      this.documentError = false;
      this.documentErrorMessage = '';
    }
  }
  
  
  

  // Método para validar la longitud del documento
  validateDocumentLength() {
    this.documentError = false; // Reinicia la bandera de error
  
    if (
      (this.Student.documentTypeId === 1 && this.Student.numberDocument.length !== 8) ||
      (this.Student.documentTypeId === 2 && this.Student.numberDocument.length !== 12)
    ) {
      this.documentError = true; // Activa el error si la longitud no coincide con el tipo de documento
    }
  }
  
  
  // Método para comprobar si se excede la longitud permitida del documento
  exceedsDocumentLength(): boolean {
    return this.documentError && (
      (this.Student.documentTypeId === 1 && this.Student.numberDocument.length > 8) ||
      (this.Student.documentTypeId === 2 && this.Student.numberDocument.length > 12)
    );
  }
}
