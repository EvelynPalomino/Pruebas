import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { Course } from 'src/app/models/course.model';
import { Note } from 'src/app/models/note.model';
import { Student } from 'src/app/models/student.model';
import { Teacher } from 'src/app/models/teacher.model';
import { Grade } from 'src/app/models/grade.model';
import { CourseService } from 'src/app/services/course.services';
import { GradeService } from 'src/app/services/grade.services';
import { NotesService } from 'src/app/services/note.services';
import { StudentService } from 'src/app/services/student.services';
import { TeacherServices } from 'src/app/services/teacher.services';
import Swal from 'sweetalert2';
import { NoteFormComponent } from 'src/app/forms/note-form/note-form.component';


@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {
  notes: Note[] = [];
  teachers: Teacher[] = [];
  students: Student[] = [];
  courses: Course[] = [];
  grades: Grade[] = [];
  displayedNotes: Note[] = [];
  currentPage = 1;
  itemsPerPage = 7;
  showForm = false;
  selectedNote: Note | null = null;
  showAddFormText: string = 'Nuevo Nota';
  showAddFormSubtitle: string = 'Agrega un nueva nota a la lista';



  // Variables para el formulario
  newNoteForm: Note = {
    id_note: 0,
    teacher_id: 1,
    student_id: 1,
    courser_id: 1,
    grade_id: 1,
    noteDetail: {
      id_notedetail: 0,
      comment_register: '',
      date_submitted: new Date(),
      status_note: '',
    }
  };

  imports!: [
    // ... Otras importaciones
    FormsModule
  ];
  searchQuery: string = '';
  modalService: any;
  createdNote: any;

  // ... (métodos y funciones existentes)

  search(): void {
    if (this.searchQuery.trim() !== '') {

      this.displayedNotes = this.notes.filter(note =>
        this.getTeacherNameById(note.teacher_id).toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.displayedNotes = this.notes;
    }
  }


  clearSearch(): void {
    this.searchQuery = '';
    this.getNotes();
  }

  showAddForm(): void {

    this.showForm = true;
  }






  // Combobox options
  statusOptions: string[] = ['A', 'P', 'D'];

  constructor(
    private noteService: NotesService,
    private teacherService: TeacherServices,
    private studentService: StudentService,
    private courseService: CourseService,
    private gradeService: GradeService,

  ) { this.showForm = false; }


  goToPage(pageNumber: number) {
    this.currentPage = pageNumber;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedNotes = this.notes.slice(startIndex, endIndex);
  }

  ngOnInit(): void {
    this.getNotes();
    this.getTeachers();
    this.getStudents();
    this.getCourses();
    this.getGrades();
  }



  getNotes(): void {
    this.noteService.findAll()
      .subscribe(notes => this.notes = notes);
  }

  deleteNoteConfirmation(note: Note): void {
    if (note && note.id_note) {
      // Muestra un modal de confirmación
      Swal.fire({
        title: '¿Eliminar nota?',
        text: `Si eliminas la nota, se eliminará permanentemente.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result: { isConfirmed: any; }) => {
        // Si el usuario confirma la eliminación, procede a eliminar la nota
        if (result.isConfirmed) {
          this.noteService.deleteNote(note.id_note).subscribe(
            response => {
              // Elimina la nota de la lista después de la eliminación exitosa
              this.notes = this.notes.filter(n => n !== note);

              // Muestra un mensaje de éxito después de la eliminación
              Swal.fire('Eliminada', `Nota eliminada con éxito`, 'success');
            },
            error => {
              console.error('Error al eliminar la nota:', error);
              Swal.fire('Error', `No se pudo eliminar la nota`, 'error');
            }
          );
        }
      });
    } else {
      console.error('Nota inválida o sin ID');
    }
  }


  getTeachers(): void {
    this.teacherService.getTeachers()
      .subscribe(teachers => {
        this.teachers = teachers;
      });
  }

  getTeacherNameById(teacher_id: number): string {
    const teacher = this.teachers.find(t => t.idTeacher === teacher_id);
    return teacher ? `${teacher.nameTeacher} ${teacher.lastNameTeacher}` : '';
  }


  getStudents(): void {
    this.studentService.getStudents()
      .subscribe(students => {
        this.students = students;
      });
  }

  getStudentNameById(student_id: number): string {
    const student = this.students.find(s => s.id === student_id);
    return student ? `${student.names} ${student.lastName}` : '';
  }

  getCourses(): void {
    this.courseService.getCourses()
      .subscribe(courses => {
        this.courses = courses;
      });
  }

  getCourseNameById(courser_id: number): string {
    const course = this.courses.find(c => c.id === courser_id);
    return course ? course.name : '';
  }

  getGrades(): void {
    this.gradeService.getGrades()
      .subscribe(grades => {
        this.grades = grades;
      });
  }

  getGradeInfoById(grade_id: number): string {
    const grade = this.grades.find(g => g.id === grade_id);
    return grade ? `${grade.grade} "${grade.section}"` : '';
  }


  // ... Código previo

  getStatusDescription(statusCode: string): string {
    switch (statusCode) {
      case 'A':
        return 'Aprobado';
      case 'D':
        return 'Desaprobado';
      case 'P':
        return 'Pendiente';
      default:
        return 'Desconocido'; // Puedes manejar cualquier otro estado no esperado aquí
    }
  }


  openCreateModal(): void {
    this.createdNote = new Note();
    this.showForm = true;

    const modalRef = this.modalService.open(NoteFormComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.note = this.createdNote;
    modalRef.result.then(
      (result: string) => {
        if (result === 'created') {

        }
      },
      (reason: string) => {
        if (reason === 'closed') {
          this.closeCreatedModal();
        }
      }
    );
  }

  closeCreatedModal() {
    this.showForm = false;
  }


}