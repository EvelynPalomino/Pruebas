import { Component, OnInit } from '@angular/core';

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
      date_submitted: new Date().toISOString(),
      status_note: '',
    }
  };

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
  }


  
  getNotes(): void {
    this.noteService.findAll()
      .subscribe(notes => this.notes = notes);
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
      .subscribe(students => this.students = students);
  }
  
  getCourses(): void {
    this.courseService.getCourses()
      .subscribe(courses => this.courses = courses);
  }
  
  

}