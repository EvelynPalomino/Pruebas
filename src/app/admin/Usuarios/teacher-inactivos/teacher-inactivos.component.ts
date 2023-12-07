import { Component, OnInit } from '@angular/core';
import { Teacher } from 'src/app/models/teacher.model';
import { TeacherServices } from 'src/app/services/teacher.services';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-teacher-inactivos',
  templateUrl: './teacher-inactivos.component.html',
  styleUrls: ['./teacher-inactivos.component.css']
})
export class TeacherInactivosComponent implements OnInit {
  inactiveTeachers: Teacher[] = [];

  constructor(private teacherService: TeacherServices, private http: HttpClient) {}

  ngOnInit() {
    this.teacherService.getInactiveTeachers().subscribe(
      teachers => this.inactiveTeachers = teachers
    );
  }

  restoreTeacher(teacher: Teacher): void {
    if (teacher && teacher.idTeacher) {
      // Muestra un modal de confirmación
      Swal.fire({
        title: '¿Restaurar profesor?',
        text: `¿Quieres restaurar al Teacher ${teacher.nameTeacher}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, restaurar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        // Si el usuario confirma la restauración, procede a restaurar al profesor
        if (result.isConfirmed) {
          this.teacherService.restoreTeacher(teacher.idTeacher).subscribe(() => {
            // Elimina el profesor de la lista de inactivos después de la restauración exitosa
            this.inactiveTeachers = this.inactiveTeachers.filter(tea => tea !== teacher);

            // Muestra un mensaje de éxito después de la restauración
            Swal.fire('Restaurado', `Teacher ${teacher.nameTeacher} restaurado con éxito`, 'success');
          },
            error => {
              console.error('Error al restaurar al profesor:', error);
            });
        }
      });
    } else {
      console.error('Profesor inválido o sin ID');
    }
  }

  delete(teacher: Teacher): void {
    if (teacher && teacher.idTeacher) {
      // Muestra un modal de confirmación
      Swal.fire({
        title: '¿Eliminar profesor?',
        text: `Si eliminas al profesor ${teacher.nameTeacher}, se eliminará completamente.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        // Si el usuario confirma la eliminación, procede a eliminar al profesor
        if (result.isConfirmed) {
          this.teacherService.delete(teacher.idTeacher).subscribe(
            response => {
              // Elimina el profesor de la lista de inactivos después de la eliminación exitosa
              this.inactiveTeachers = this.inactiveTeachers.filter(tea => tea !== teacher);

              // Muestra un mensaje de éxito después de la eliminación
              Swal.fire('Eliminado', `Profesor ${teacher.nameTeacher} eliminado con éxito`, 'success');
            },
            error => {
              console.error('Error al eliminar al profesor inactivo:', error);
            }
          );
        }
      });
    } else {
      console.error('Profesor inválido o sin ID');
    }
  }
  exportToCSV() {
    // Realizar una solicitud HTTP GET para obtener los datos desde tu API
    fetch('http://localhost:8085/app/v1/teachers')
      .then(response => response.json())
      .then(data => {
        // Filtrar profesores inactivos (stateTeacher === 'I')
        const inactiveTeachers = data.filter((teacher: { stateTeacher: string; }) => teacher.stateTeacher === 'I');

        // Convertir los datos a formato CSV
        const csvData = this.convertToCSV(inactiveTeachers);

        // Crear un elemento <a> para descargar el archivo CSV
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'TeacherInactivos.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch(error => console.error('Error al obtener datos:', error));
  }

  convertToCSV(data: any[]) {
    if (data.length === 0) {
      return '';
    }

    const header = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).join(','));
    return `${header}\n${rows.join('\n')}`;
  }
  exportToExcel() {
    // Realizar una solicitud HTTP GET para obtener los datos desde tu API
    this.http.get<any[]>('http://localhost:8085/app/v1/teachers')
      .subscribe((data: any[]) => {
        // Filtrar profesores inactivos
        const inactiveTeachers = data.filter(teacher => teacher.stateTeacher === 'I');
  
        // Convertir los datos filtrados a un libro de Excel
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(inactiveTeachers);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Exported Data');
  
        // Crear un archivo array y descargarlo
        const arrayBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'TeacherInactivos.xlsx';
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
  
    pdf.save('TeacherInactivos.pdf');
  }
  
  
}
