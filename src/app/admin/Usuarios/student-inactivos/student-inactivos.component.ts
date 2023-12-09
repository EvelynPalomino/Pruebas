import { Component, OnInit } from '@angular/core';
import { Student } from 'src/app/models/student.model';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { StudentService } from 'src/app/services/student.services';

@Component({
  selector: 'app-student-inactivos',
  templateUrl: './student-inactivos.component.html',
  styleUrls: ['./student-inactivos.component.css']
})
export class StudentInactivosComponent implements OnInit {
  inactiveStudents: Student[] = [];

  constructor(private  studentService: StudentService, private http: HttpClient) {}
  searchName: string = '';
  searchLastName: string = '';
  searchDocumentNumber: string = '';
  searchAcademicLevel : string = '';
  searchDocumentType: string = '';
  searchSpecialty: string = '';

  // Ajusta la función searchStudent
  searchStudentInactive() {

    this.studentService.getStudents().subscribe((students) => {
      const filteredStudents = students
        .filter((student) => student.state === 'I')
        .filter(
          (student) =>
            (this.searchName === '' ||
              student.names.toLowerCase().includes(this.searchName.toLowerCase())) &&
            (this.searchLastName === '' ||
              student.lastName.toLowerCase().includes(this.searchLastName.toLowerCase())) &&
            (this.searchDocumentNumber === '' ||
              student.numberDocument.includes(this.searchDocumentNumber)) &&
            (this.searchAcademicLevel === '' || student.academicLevelId.toString() === this.searchAcademicLevel)
        );

      this.inactiveStudents = filteredStudents;

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
    this.inactiveStudents = [];

  }

  ngOnInit() {
    this.studentService.getInactiveStudents().subscribe(
      students => this.inactiveStudents = students
    );
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


  restoreStudent(student: Student): void {
    if (student && student.id) {
      Swal.fire({
        title: '¿Restaurar estudiante?',
        text: `¿Quieres restaurar al estudiante ${student.names}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, restaurar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.studentService.restoreStudent(student.id).subscribe(() => {
            this.inactiveStudents = this.inactiveStudents.filter(std => std !== student);
            Swal.fire('Restaurado', `Estudiante ${student.names} restaurado con éxito`, 'success');
          },
            error => {
              console.error('Error al restaurar al estudiante:', error);
            });
        }
      });
    } else {
      console.error('Estudiante inválido o sin ID');
    }
  }

  deleteStudent(student: Student): void {
    if (student && student.id) {
      Swal.fire({
        title: '¿Eliminar estudiante?',
        text: `Si eliminas al estudiante ${student.names}, se eliminará completamente.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.studentService.delete(student.id).subscribe(
            response => {
              this.inactiveStudents = this.inactiveStudents.filter(std => std !== student);
              Swal.fire('Eliminado', `Estudiante ${student.names} eliminado con éxito`, 'success');
            },
            error => {
              console.error('Error al eliminar al estudiante inactivo:', error);
            }
          );
        }
      });
    } else {
      console.error('Estudiante inválido o sin ID');
    }
  }

  // exportToCSV() {
  //   this.exportDataToFormat('csv', 'StudentInactivos.csv');
  // }

  // exportToExcel() {
  //   this.exportDataToFormat('xlsx', 'StudentInactivos.xlsx');
  // }

  // exportToPDF() {
  //   this.exportDataToFormat('pdf', 'StudentInactivos.pdf');
  // }

  // exportDataToFormat(format: string, fileName: string) {
  //   const dataForFormat = this.inactiveStudents.map(({ id_student, names_student, otherProperties }) => ({ id_student, nameStudent, otherProperties }));

  //   switch (format) {
  //     case 'csv':
  //       this.exportToCSVFormat(dataForFormat, fileName);
  //       break;
  //     case 'xlsx':
  //       this.exportToExcelFormat(dataForFormat, fileName);
  //       break;
  //     case 'pdf':
  //       this.exportToPDFFormat(dataForFormat, fileName);
  //       break;
  //     default:
  //       console.error('Formato no admitido');
  //   }
  // }

  // exportToCSVFormat(data: any[], fileName: string) {
  //   const csvData = this.convertToCSV(data);
  //   this.downloadFile(csvData, fileName, 'text/csv');
  // }

  // exportToExcelFormat(data: any[], fileName: string) {
  //   const workbook = XLSX.utils.book_new();
  //   const worksheet = XLSX.utils.json_to_sheet(data);
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Exported Data');
  //   const arrayBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //   const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //   this.downloadFile(blob, fileName, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  // }

  // exportToPDFFormat(data: any[], fileName: string) {
  //   this.generatePDF(data);
  // }

  // convertToCSV(data: any[]) {
  //   if (data.length === 0) {
  //     return '';
  //   }

  //   const header = Object.keys(data[0]).join(',');
  //   const rows = data.map(item => Object.values(item).join(','));
  //   return `${header}\n${rows.join('\n')}`;
  // }

  // downloadFile(blob: Blob, fileName: string, fileType: string) {
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = fileName;
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   window.URL.revokeObjectURL(url);
  // }

  // generatePDF(data: any[]) {
  //   const pdf = new jsPDF();

  //   const headers = Object.keys(data[0]);
  //   const pdfData = data.map(item => Object.values(item));

  //   pdf.autoTable({
  //     head: [headers],
  //     body: pdfData
  //   });

  //   pdf.save('StudentInactivos.pdf');
  // }
}
