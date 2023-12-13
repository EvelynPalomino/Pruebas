import { Student } from './../../../models/student.model';
import { Component, OnInit } from '@angular/core';
import { StudentService } from 'src/app/services/student.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { StudentFormComponent } from 'src/app/forms/student-form/student-form.component';
import { Location } from '@angular/common';


@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  students: Student[] = [];
  createdStudent: Student = new Student();
  showForm: boolean = false;
  editStudent: Student | null = null;


  constructor(
    private toastr: ToastrService,
    private studentService: StudentService,
    private modalService: NgbModal,
    private http: HttpClient,
    public activateRoute: ActivatedRoute
  ) { }
  searchName: string = '';
  searchLastName: string = '';
  searchDocumentNumber: string = '';
  searchAcademicLevel: string = '';
  searchDocumentType: string = '';
  searchSpecialty: string = '';

  // Ajusta la función searchStudent
  searchStudent() {

    this.studentService.getStudents().subscribe((students) => {
      const filteredStudents = students
        .filter((student) => student.state === 'A')
        .filter(
          (student) =>
            (this.searchName === '' ||
              student.names.toLowerCase().includes(this.searchName.toLowerCase())) &&
            (this.searchLastName === '' ||
              student.lastName.toLowerCase().includes(this.searchLastName.toLowerCase())) &&
            (this.searchDocumentType === '' || student.documentTypeId.toString() === this.searchDocumentType)&&
              (this.searchDocumentNumber === '' ||
                student.numberDocument.includes(this.searchDocumentNumber)) &&
            (this.searchAcademicLevel === '' || student.academicLevelId.toString() === this.searchAcademicLevel)
        );

      this.students = filteredStudents;

      // Actualiza la visibilidad del mensaje en función de si hay resultados o no
      // Assuming you have a property like 'noResultsMessageVisible' in your component
      // this.noResultsMessageVisible = filteredStudents.length === 0;
    });
  }

  // Ajusta la función clearSearch
  clearSearch() {
    this.searchName = '';
    this.searchLastName = '';
    this.searchDocumentNumber = '';
    this.searchDocumentType = '';
    this.searchAcademicLevel = '';
    this.searchSpecialty = ''; // Agrega la limpieza del campo de especialidad
    this.students = [];

  }
  convertDocumentType(type: number | string): string {
    // Si el tipo es un número, convertirlo a cadena
    if (typeof type === 'number') {
      type = type.toString();
    }

    switch (type) {
      case '1':
        return 'DNI';
      case '2':
        return 'CNE';
      default:
        return 'Desconocido';
    }
  }

  // Función para convertir el grado académico
  convertAcademicDegree(degree: number | string): string {
    // Si el grado es un número, convertirlo a cadena
    if (typeof degree === 'number') {
      degree = degree.toString();
    }

    switch (degree) {
      case '1':
        return 'Inicial';
      case '2':
        return 'Primaria';
      case '3':
        return 'Secundaria';
      default:
        return 'Desconocido';
    }
  }

  convertGradeId(gradeId: number | string): string {
    if (typeof gradeId === 'number') {
      gradeId = gradeId.toString();
    }

    switch (gradeId) {
      case '1':
        return '1 "A"';
      case '2':
        return '1 "B"';
      case '3':
        return '1 "C"';
      case '4':
        return '1 "D"';
      case '5':
        return '1 "E"';
      case '6':
        return '2 "A"';
      case '7':
        return '2 "B"';
      case '8':
        return '2 "C"';
      case '9':
        return '2 "D"';
      case '10':
        return '2 "E"';
      case '11':
        return '3 "A"';
      case '12':
        return '3 "B"';
      case '13':
        return '3 "C"';
      case '14':
        return '3 "D"';
      case '15':
        return '3 "E"';
      case '16':
        return '4 "A"';
      case '17':
        return '4 "B"';
      case '18':
        return '4 "C"';
      case '19':
        return '4 "D"';
      case '20':
        return '4 "E"';
      case '21':
        return '5 "A"';
      case '22':
        return '5 "B"';
      case '23':
        return '5 "C"';
      case '24':
        return '5 "D"';
      case '25':
        return '5 "E"';
      case '26':
        return '6 "A"';
      case '27':
        return '6 "B"';
      case '28':
        return '6 "C"';
      case '29':
        return '6 "D"';
      case '30':
        return '6 "E"';
      default:
        return 'Desconocido';
    }
  }



  ngOnInit() {
    this.studentService.getStudents().subscribe((students) => {
      // Filtra solo los estudiantes con stateTeacher === 'A'
      const filteredStudents = students.filter(
        (student) => student.state === 'A'
      );

      // Ordena los estudiantes filtrados por apellidos y, en caso de empate, por nombres
      this.students = filteredStudents.sort((a, b) => {
        const lastNameComparison = a.lastName.localeCompare(
          b.lastName
        );
        if (lastNameComparison === 0) {
          return a.names.localeCompare(b.names);
        }
        return lastNameComparison;
      });
    });
  }
  openCreateModal(): void {
    this.createdStudent = new Student();
    this.showForm = true;

    const modalRef = this.modalService.open(StudentFormComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.Student = this.createdStudent;
    modalRef.result.then(
      (result) => {
        if (result === 'created') {
        }
      },
      (reason) => {
        if (reason === 'closed') {
          this.closeCreatedModal();
        }
      }
    );
  }
  openEditModal(Student: Student): void {
    this.editStudent = Student;
    this.showForm = true;

    const modalRef = this.modalService.open(StudentFormComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.Student = Student;
    modalRef.result.then(
      (result) => {
        if (result === 'edited') {
        }
      },
      (reason) => {
        if (reason === 'closed') {
          this.closeEditModal();
        }
      }
    );
  }
  closeEditModal() {
    this.showForm = false;
  } closeCreatedModal() {
    this.showForm = false;
  }
  deleteStudent(student: Student): void {
    // Muestra un modal de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar al estudiante ${student.names}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      // Si el usuario confirma la eliminación, procede a eliminar al estudiante
      if (result.isConfirmed) {
        this.studentService
          .deleteDeactivate(student.id)
          .subscribe((response) => {
            // Elimina al estudiante de la lista después de la eliminación exitosa
            this.students = this.students.filter((std) => std !== student);

            // Muestra un mensaje de éxito después de la eliminación
            Swal.fire(
              'Eliminado',
              `Estudiante ${student.names} eliminado con éxito`,
              'success'
            );
          });
      }
    });
  }

}
