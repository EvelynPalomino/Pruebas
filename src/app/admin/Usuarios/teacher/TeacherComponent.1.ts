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
import autoTable from 'jspdf-autotable';



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
  searchTeachers() {
    this.teacherService.getTeachers().subscribe((teachers) => {
      const filteredTeachers = teachers
        .filter((teacher) => teacher.stateTeacher === 'A')
        .filter(
          (teacher) =>
            (this.searchName === '' ||
              teacher.nameTeacher.toLowerCase().includes(this.searchName.toLowerCase())) &&
            (this.searchLastName === '' ||
              teacher.lastNameTeacher.toLowerCase().includes(this.searchLastName.toLowerCase())) &&
            (this.searchDocumentType === '' || teacher.documentTypeId.toString() === this.searchDocumentType) &&
            (this.searchDocumentNumber === '' ||
              teacher.documentNumber.includes(this.searchDocumentNumber)) &&
            (this.searchSpecialty === '' || teacher.courseId.toString() === this.searchSpecialty)
        );

      this.teachers = filteredTeachers;

    });
  }

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
  convertCourse(courseId: number | string): string {
    if (typeof courseId === 'number') {
      courseId = courseId.toString();
    }

    switch (courseId) {
      case '1':
        return 'Matematica';
      case '2':
        return 'Ciencia';
      case '3':
        return 'English';
      case '4':
        return 'Historia';
      case '5':
        return 'Personal Social';
      case '6':
        return 'Arte';
      case '7':
        return 'Biologia';
      case '8':
        return 'Geografia';
      case '9':
        return 'Computación';
      case '10':
        return 'Literatura';
      case '11':
        return 'Arte';
      case '12':
        return 'Ciencia y Tecnologia';
      case '13':
        return 'Religión';
      case '14':
        return 'Comunicación';
      case '15':
        return 'Comprensión Lectora';
      default:
        return 'Desconocido';
    }
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

  //EXPORTACION DE DATOS
  exportToPDF() {
    Swal.fire({
      title: 'Exportar informe',
      text: '¿Deseas exportar este informe de las alumnas?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Exportar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Exportando a PDF');

        if (!this.teachers || this.teachers.length === 0) {
          console.error('No hay datos de alumnas disponibles.');
          return;
        }

        const doc = new jsPDF('landscape');

        // Agregar fondo rojo a la izquierda de la cabecera y ajustar la altura
        doc.setFillColor(255, 255, 255); // Fondo rojo
        doc.rect(0, 0, doc.internal.pageSize.width, 60, 'F'); // Rectángulo rojo para toda la cabecera


        // Agregar título en medio de la cabecera con color rojo
        doc.setFillColor(255, 0, 0); // Cambiar color de fondo de la cabecera a rojo
        doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F'); // Rectángulo como fondo de la cabecera

        // Agregar imagen a la derecha
        const logoUrl = 'https://i.ibb.co/gWGwbyQ/330158531-1321988551711293-7007550439193672835-n.jpg'; // Reemplaza 'ruta_de_tu_imagen/logo.png' con la ruta correcta de tu imagen
        const imageWidth = 30; // Ancho de la imagen
        const imageHeight = 30; // Alto de la imagen
        const imageX = doc.internal.pageSize.width - imageWidth - 20; // Coloca la imagen a la derecha
        const imageY = 5; // Ajusta la posición vertical según tus necesidades
        doc.addImage(logoUrl, 'PNG', imageX, imageY, imageWidth, imageHeight);

        doc.setTextColor(255, 255, 255); // Texto blanco
        doc.setFont("helvetica", "bold"); // Cambiar a una fuente en negrita (puedes ajustar según las fuentes disponibles en tu entorno)
        doc.setFontSize(24); // Tamaño del título aumentado
        const title = 'Listado de Profesores';
        const titleWidth = doc.getStringUnitWidth(title) * 24; // Ajusta el factor según tus necesidades
        const middleOfPage = doc.internal.pageSize.width / 2;
        const titleX = middleOfPage - titleWidth / 2; // Ajusta el desplazamiento hacia la derecha y el factor según tus necesidades
        const titleY = 25; // Ajusta la posición vertical según tus necesidades
        doc.text(title, titleX, titleY);




        const columns = [
          ['APELLIDO', 'NOMBRE', 'TIPO DOC', 'N° DOC', 'CORREO', 'CELULAR', 'USUARIO'],
        ];

        // Ajusta la posición vertical para aumentar la separación entre la cabecera y la tabla
        const separationSpace = 40; // Ajusta según sea necesario
        const startY = titleY + separationSpace;

        autoTable(doc, {
          head: columns,
          body: this.teachers.map(teachers => [
            teachers.lastNameTeacher,
            teachers.nameTeacher,
            teachers.documentTypeId,
            teachers.documentNumber,
            teachers.email,
            teachers.phoneNumber,
            teachers.userTeacher,
            teachers.salary,
          ]),
          startY: startY,
          tableWidth: 'auto',
          styles: {
            textColor: [0, 0, 0], // Color del texto de las filas (negro)
            fontSize: 10,
          },
          headStyles: {
            // Estilo de la cabecera (en este caso, a todas las columnas)
            fillColor: [255, 0, 0], // Color rojo
            textColor: [255, 255, 255], // Texto blanco
          },
        });

        doc.save('Teacher.pdf');

        Swal.fire({
          icon: 'success',
          title: '¡Jasper Report exportado!',
          text: 'El jasper report de apoderados se ha exportado exitosamente.',
        });
      }
    });
  }

  generatePDF(data: any[]) {
    const pdf = new jsPDF();

    const headers = Object.keys(data[0]);
    const pdfData = data.map(item => Object.values(item));

    pdf.save('TeacherActivos.pdf');
  }
}
