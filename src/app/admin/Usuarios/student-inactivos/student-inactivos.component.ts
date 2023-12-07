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

  ngOnInit() {
    this.studentService.getInactiveStudents().subscribe(
      students => this.inactiveStudents = students
    );
  }

  restoreStudent(student: Student): void {
    if (student && student.id_student) {
      Swal.fire({
        title: '¿Restaurar estudiante?',
        text: `¿Quieres restaurar al estudiante ${student.names_student}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, restaurar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.studentService.restoreStudent(student.id_student).subscribe(() => {
            this.inactiveStudents = this.inactiveStudents.filter(std => std !== student);
            Swal.fire('Restaurado', `Estudiante ${student.names_student} restaurado con éxito`, 'success');
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
    if (student && student.id_student) {
      Swal.fire({
        title: '¿Eliminar estudiante?',
        text: `Si eliminas al estudiante ${student.names_student}, se eliminará completamente.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.studentService.delete(student.id_student).subscribe(
            response => {
              this.inactiveStudents = this.inactiveStudents.filter(std => std !== student);
              Swal.fire('Eliminado', `Estudiante ${student.names_student} eliminado con éxito`, 'success');
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
