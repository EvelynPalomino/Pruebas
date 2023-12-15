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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


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
  searchQuery: string = '';
  displayedNotes: Note[] = [];
  currentPage = 1;
  itemsPerPage = 7;
  showForm = false;
  selectedNote: Note | null = null;
  errorMessage = '';
  showAddFormText: string = 'Nuevo Nota';
  showAddFormSubtitle: string = 'Agrega un nueva nota a la lista';
  errorText: string = '';
  successMessage: string = '';
  createdNote: Note = new Note();
  // Función para mostrar la alerta de Swal
  showSwalAlert(icon: any, title: string, text: string): void {
    Swal.fire({
      icon,
      title,
      text,
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
  }

  // Función para confirmar la eliminación de una nota
  confirmNoteDeletion(): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.showSwalAlert('error', 'Cancelled', 'Your imaginary file is safe :)');
      }
    });
  }

  public searchNotes(): void {
    // Filtrar las notas según el término de búsqueda (searchQuery)
    this.displayedNotes = this.notes.filter(note =>
      this.getStudentNameById(note.student_id).toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      this.getTeacherNameById(note.teacher_id).toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Variables para el formulario
  newNoteForm: Note = {
    id_note: 0,
    teacher_id: 1,
    courser_id: 1,
    student_id: 1,
    grade_id: 1,
    noteDetail: {
      id_notedetail: 0,
      comment_register: '',
      date_submited: this.getFutureDate(3),
      status_note: 'A'
    }
  };

  // Combobox options
  statusOptions: string[] = ['A', 'P', 'D'];

  constructor(
    private modalService: NgbModal,
    private notesService: NotesService,
    private teacherService: TeacherServices,
    private studentService: StudentService,
    private courseService: CourseService,
    private gradeService: GradeService
    
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
    this.notesService.findAll()
      .subscribe(notes => {
        this.notes = notes.sort((a, b) => a.id_note - b.id_note);
      });
  }

  getTeachers(): void {
    this.teacherService.getTeachers()
      .subscribe(teachers => this.teachers = teachers);
  }

  getStudents(): void {
    this.studentService.getStudents()
      .subscribe(students => this.students = students);
  }

  getCourses(): void {
    this.courseService.getCourses()
      .subscribe(courses => this.courses = courses);
  }

  getGrades(): void {
    this.gradeService.getGrades()
      .subscribe((grades: Grade[]) => this.grades = grades);
  }

  addNote(): void {
    // Validar la categoría antes de agregar la nota
   

    // Lógica para agregar la nota utilizando el servicio
    // Lógica para agregar la nota utilizando el servicio
    this.notesService['saveNote'](this.newNoteForm)
      .subscribe(
        (data: any) => {
          console.log('Nota guardada exitosamente:', data);
          this.getNotes(); // Actualiza la lista de notas después de agregar una nueva
          this.newNoteForm = {  // Crea un nuevo objeto newNoteForm
            id_note: 0,
            teacher_id: 0,
            courser_id: 0,
            student_id: 0,
            grade_id: 0,
            noteDetail: {
              id_notedetail: 0,
              comment_register: '',
              date_submited: this.getFutureDate(3),
              status_note: 'A'
            }
          };
          this.showSuccessMessage('Nota guardada exitosamente');
          this.showForm = false;  // Cierra el formulario después de guardar
        },
        (error: any) => {
          console.error('Error al guardar nota. Inténtalo de nuevo:', error);
        }
      );
  }

  // Función para mostrar un mensaje de éxito durante un tiempo específico
  private showSuccessMessage(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }



  resetForm(): void {
    this.newNoteForm = {
      id_note: 0,
      teacher_id: 0,
      courser_id: 0,
      student_id: 0,
      grade_id: 0,
      noteDetail: {
        id_notedetail: 0,
        comment_register: '',
        date_submited: this.getFutureDate(3),
        status_note: 'A'
      }
    };
  }


  // Función para obtener una fecha futura en el formato deseado (YYYY-MM-DD)
  getFutureDate(daysToAdd: number): string {
    const today = new Date();
    today.setDate(today.getDate() + daysToAdd);

    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }

  cancelAdd(): void {

    this.showForm = false; // Oculta el formulario al cancelar
    // Otras acciones para cancelar, si es necesario
  }

  public editNote(note: Note): void {
    this.errorMessage = '';
    this.showForm = true;
    this.showAddFormText = 'Nota de edición';
    this.showAddFormSubtitle = 'Introduce los nuevos datos';

    // Convertir el formato de fecha si es necesario
    const formattedDateNote = this.getFormattedDate(note.noteDetail.date_submited);

    // Asignar los valores del objeto note al formulario newNoteForm
    this.newNoteForm = {
      id_note: note.id_note,
      teacher_id: note.teacher_id,
      courser_id: note.courser_id,
      student_id: note.student_id,
      grade_id: note.grade_id,
      noteDetail: {
        id_notedetail: note.noteDetail.id_notedetail,
        comment_register: note.noteDetail.comment_register,
        date_submited: formattedDateNote,
        status_note: note.noteDetail.status_note
      }
    };
  }

  private getFormattedDate(originalDate: string): string {
    const dateObject = new Date(originalDate);
    const year = dateObject.getFullYear();
    const month = ('0' + (dateObject.getMonth() + 1)).slice(-2);
    const day = ('0' + dateObject.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }


  updateNote(): void {
    if (this.selectedNote) {
      // Actualizar la nota utilizando el servicio
      // Actualizar la nota utilizando el servicio
      this.notesService['saveNote'](this.newNoteForm)
        .subscribe(() => {
          this.getNotes();
          this.resetForm();
          this.errorMessage = '';
          this.showForm = true;
          this.showAddFormText = 'Nueva Nota';
          this.showAddFormSubtitle = 'Añadir un nueva nota a la lista';
        });
    }
  }

  getTeacherNameById(teacher_id: number): string {
    const teacher = this.teachers.find(t => t.idTeacher === teacher_id);
    return teacher ? `${teacher.nameTeacher} ${teacher.lastNameTeacher}` : '';
  }

  getStudentNameById(student_id: number): string {
    const student = this.students.find(s => s.id === student_id);
    return student ? `${student.names} ${student.lastName}` : '';
  }

  getCourseNameById(courser_id: number): string {
    const course = this.courses.find(c => c.id === courser_id);
    return course ? course.name : '';
  }

  getStatusDescription(statesCode: string): string {
    switch (statesCode) {
      case 'A':
        return 'Aprobados';
      case 'P':
        return 'Pendiente';
      case 'D':
        return 'Desaprobados';
      default:
        return 'Desconocido';
    }
  }
  getGradeInfoById(grade_id: number): string {
    const grade = this.grades.find(g => g.id === grade_id);
    return grade ? `${grade.grade} "${grade.section}"` : '';
  }


  deleteNoteConfirmation(note: Note): void {
    if (note && note.id_note) {
      // Muestra un modal de confirmación
      Swal.fire({
        title: '¿Eliminar nota?',
        text: 'Si eliminas la nota, se eliminará permanentemente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result: { isConfirmed: any; }) => {
        // Si el usuario confirma la eliminación, procede a eliminar la nota
        if (result.isConfirmed) {
          this.notesService.deleteNote(note.id_note).subscribe(
            response => {
              // Elimina la nota de la lista después de la eliminación exitosa
              this.notes = this.notes.filter(n => n !== note);

              // Muestra un mensaje de éxito después de la eliminación
              Swal.fire('Eliminada', 'Nota eliminada con éxito', 'success');
            },
            error => {
              console.error('Error al eliminar la nota:', error);
              Swal.fire('Error', 'No se pudo eliminar la nota', 'error');
            }
          );
        }
      });
    } else {
      console.error('Nota inválida o sin ID');
    }
  }



} 