import { Course } from './../../../models/course.model';
import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/services/course.services';
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
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  courses: Course[] = [];
  createdCourse: Course = new Course();
  showForm: boolean = false;
  editCourse: Course | null = null;

  constructor(
    private toastr: ToastrService,
    private courseService: CourseService,
    private modalService: NgbModal,
    private http: HttpClient,
    public activateRoute: ActivatedRoute
  ) { }

  // Declara las propiedades de búsqueda para Course
  searchName: string = '';

  searchCourse() {
    this.courseService.getCourses().subscribe((courses) => {
      // Filtra los cursos según los criterios de búsqueda
      const filteredCourses = courses.filter(
        (course) =>
          course.stateCourse === 'A'
      );

      this.courses = filteredCourses;


    });
  }

  // Función para limpiar los filtros de búsqueda
  clearSearch() {
    this.searchName = '';
    this.courses = [];
  }


  ngOnInit() {
    // Inicialización de cursos al cargar el componente
    this.courseService.getCourses().subscribe((courses) => {

    });
  }

  openCreateCourseModal(): void {
    this.createdCourse = new Course();
    this.showForm = true;

    const modalRef = this.modalService.open(CourseFormComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.Course = this.createdCourse;
    modalRef.result.then(
      (result) => {
        if (result === 'created') {
          // Realiza acciones adicionales después de crear un curso si es necesario
        }
      },
      (reason) => {
        if (reason === 'closed') {
          this.closeCreatedModal();
        }

      }
    );
  }
  openEditCourseModal(course: Course): void {
    this.editCourse = course;
    this.showForm = true;

    const modalRef = this.modalService.open(CourseFormComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.Course = course;
    modalRef.result.then(
      (result) => {
        if (result === 'edited') {
          // Realiza acciones adicionales después de editar un curso si es necesario
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
  }

  closeCreatedModal() {
    this.showForm = false;
  }

  deleteCourse(course: Course): void {
    // Muestra un modal de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar el curso ${course.nameCourse}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      // Si el usuario confirma la eliminación, procede a eliminar el curso
      if (result.isConfirmed) {
        this.courseService
          .deleteCourse(course.idCourse)
          .subscribe(() => {
            // Elimina el curso de la lista después de la eliminación exitosa
            this.courses = this.courses.filter((c) => c !== course);

            // Muestra un mensaje de éxito después de la eliminación
            Swal.fire(
              'Eliminado',
              'Curso'


            );
          });
      }
    });
  }

}
