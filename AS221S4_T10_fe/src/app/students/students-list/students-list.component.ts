import { Component, OnInit } from '@angular/core';
import { StudentService } from 'src/app/services/students.service';
import { IStudent } from 'src/app/interfaces/students.interface';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.css'],
})
export class StudentsListComponent implements OnInit {
  students: IStudent[] = [];

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.getStudents();
  }

  getStudents() {
    this.studentService.findAll().subscribe((data: IStudent[]) => {
      this.students = data;
    });
  }
}