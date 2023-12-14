import { Component, OnInit } from '@angular/core';
import { Teacher } from '../../models/teacher.model';
import { TeacherServices } from 'src/app/services/teacher.services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-teacher-edit',
  templateUrl: './teacher-edit.component.html',
  styleUrls: ['./teacher-form-edit.component.css']
})
export class TeacherEditComponent implements OnInit {

  teacher: Teacher = new Teacher();

  constructor(
    public teacherServices: TeacherServices,
    public activateRoute: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
    this.loadTeacher();
  }

  loadTeacher(): void {
    this.activateRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.teacherServices.getTeacher(id).subscribe((teacher) => this.teacher = teacher);
      }
    });
  }

  update(): void {
    // Establece el estado como "A" antes de enviarlo al servicio
    this.teacher.stateTeacher = 'A';

    this.teacherServices.update(this.teacher).subscribe(teacher => {
      this.router.navigate(['/Teacher']);
    });
  }
}
