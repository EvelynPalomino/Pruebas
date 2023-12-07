import { Component, OnInit } from '@angular/core';
import { Teacher } from 'src/app/models/teacher.model';
import { TeacherServices } from 'src/app/services/teacher.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { TeacherFormComponent } from 'src/app/forms/teacher-form/teacher-form.component';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';



@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css'],
})
export class TeacherComponent implements OnInit {
  teachers: Teacher[] = [];
  showForm: boolean = false;
  editTeacher: Teacher | null = null;
  createdTeacher: Teacher = new Teacher();
  noResultsMessageVisible: boolean | undefined;
  constructor(
    private toastr: ToastrService,
    private teacherService: TeacherServices,
    private modalService: NgbModal,
    private http: HttpClient,
    public activateRoute: ActivatedRoute
  ) { }
  searchName: string = '';
  searchLastName: string = '';
  searchDocumentNumber: string = '';
  searchDocumentType: string = '';
  searchSpecialty: string = '';

  // // Ajusta la función searchTeachers
  // searchTeachers() {
  //   this.teacherService.getTeachers().subscribe((teachers) => {
  //     const filteredTeachers = teachers
  //       .filter((teacher) => teacher.stateTeacher === 'A')
  //       .filter(
  //         (teacher) => (this.searchName === '' ||
  //           teacher.nameTeacher
  //             .toLowerCase()
  //             .includes(this.searchName.toLowerCase())) &&
  //           (this.searchLastName === '' ||
  //             teacher.lastNameTeacher
  //               .toLowerCase()
  //               .includes(this.searchLastName.toLowerCase())) &&
  //           ((this.searchDocumentType === '' &&
  //             (teacher.documentType === 'DNI' ||
  //               teacher.documentType === 'CNE')) ||
  //             (this.searchDocumentType !== '' &&
  //               teacher.documentTypeId === this.searchDocumentType)) &&
  //           (this.searchDocumentNumber === '' ||
  //             teacher.documentNumber.includes(this.searchDocumentNumber)) &&
  //           (this.searchSpecialty === '' ||
  //             teacher.specialization
  //               .toLowerCase()
  //               .includes(this.searchSpecialty.toLowerCase()))
  //       );

  //    k
  // Ajusta la función clearSearch
  clearSearch() {
    this.searchName = '';
    this.searchLastName = '';
    this.searchDocumentNumber = '';
    this.searchDocumentType = '';
    this.searchSpecialty = ''; // Agrega la limpieza del campo de especialidad
    this.teachers = [];
    this.noResultsMessageVisible = false;
  }

  ngOnInit() {
    this.teacherService.getTeachers().subscribe((teachers) => {
      // Filtra solo los profesores con stateTeacher === 'A'
      const filteredTeachers = teachers.filter(
        (teacher) => teacher.stateTeacher === 'A'
      );

      // Ordena los profesores filtrados por apellidos y, en caso de empate, por nombres
      this.teachers = filteredTeachers.sort((a, b) => {
        const lastNameComparison = a.lastNameTeacher.localeCompare(
          b.lastNameTeacher
        );
        if (lastNameComparison === 0) {
          return a.nameTeacher.localeCompare(b.nameTeacher);
        }
        return lastNameComparison;
      });
    });
  }

  delete(teacher: Teacher): void {
    // Muestra un modal de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar al profesor ${teacher.nameTeacher}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      // Si el usuario confirma la eliminación, procede a eliminar el profesor
      if (result.isConfirmed) {
        this.teacherService
          .deleteDesactivate(teacher.idTeacher)
          .subscribe((response) => {
            // Elimina el profesor de la lista después de la eliminación exitosa
            this.teachers = this.teachers.filter((tea) => tea !== teacher);

            // Muestra un mensaje de éxito después de la eliminación
            Swal.fire(
              'Eliminado',
              `Profesor ${teacher.nameTeacher} eliminado con éxito`,
              'success'
            );
          });
      }
    });
  }

  openEditModal(teacher: Teacher): void {
    this.editTeacher = teacher;
    this.showForm = true;

    const modalRef = this.modalService.open(TeacherFormComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.teacher = teacher;
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

  openCreateModal(): void {
    this.createdTeacher = new Teacher();
    this.showForm = true;

    const modalRef = this.modalService.open(TeacherFormComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.teacher = this.createdTeacher;
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

  closeCreatedModal() {
    this.showForm = false;
  }
  closeEditModal() {
    this.showForm = false;
  }
  cargarTeacher() {
    this.activateRoute.params.subscribe((params) => {
      let id = params['id'];
      if (id) {
        this.teacherService
          .getTeacher(id)
          .subscribe((teacher) => (teacher = teacher));
      }
    });
  }

  exportToCSV() {
    // Realizar una solicitud HTTP GET para obtener los datos desde tu API
    fetch('http://localhost:8085/app/v1/teachers')
      .then(response => response.json())
      .then(data => {
        // Convertir los datos a formato CSV
        const csvData = this.convertToCSV(data);

        // Crear un elemento <a> para descargar el archivo CSV
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Teacher.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch(error => console.error('Error al obtener datos:', error));
  }

  convertToCSV(data: any[]) {
    const header = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).join(','));
    return `${header}\n${rows.join('\n')}`;
  }

  exportToExcel() {
    // Realizar una solicitud HTTP GET para obtener los datos desde tu API
    this.http.get<any[]>('http://localhost:8085/app/v1/teachers')
      .subscribe((data: any[]) => {
        // Convertir los datos a un libro de Excel
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Exported Data');

        // Crear un archivo array y descargarlo
        const arrayBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Teacher.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
  }

  exportToPDF() {
    this.http.get<any[]>('http://localhost:8085/app/v1/teachers').subscribe(
      (data: any[]) => {
        if (data && data.length > 0) {
          this.generatePDF(data);
        } else {
          console.warn('No hay datos para generar el PDF.');
        }
      },
      (error) => {
        console.error('Error al obtener datos:', error);
      }
    );
  }
  
  generatePDF(data: any[]) {
    const pdf = new jsPDF();
  
    const headers = Object.keys(data[0]);
    const pdfData = data.map(item => Object.values(item));
  
    pdf.save('TeacherActivos.pdf');
  }
}
