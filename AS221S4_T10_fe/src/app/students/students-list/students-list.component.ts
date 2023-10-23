import { Component, OnInit } from '@angular/core';
import { StudentService } from 'src/app/services/students.service';
import { IStudent } from 'src/app/interfaces/students.interface';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.css'],
})
export class StudentsListComponent implements OnInit {
  
  deleteStudent(id_student: number){
    this.studentService.delete(id_student).subscribe(data => {
      this.students = this.students?.filter(student => student.id_student !== id_student)
    })
  }

  
updateStudent(arg0: any) {
throw new Error('Method not implemented.');
}
  students: IStudent[] = [];

  constructor(private studentService: StudentService) {}


  getStudents() {
    this.studentService.findAll().subscribe((data: IStudent[]) => {
      this.students = data;
    });
  }

  ngOnInit() {
    this.getStudents();
  }

}