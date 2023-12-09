import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherComponent } from './admin/Usuarios/teacher/TeacherComponent.1';
import { LoginComponent } from './admin/Pages/login/login.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { TeacherFormComponent } from './forms/teacher-form/teacher-form.component';
import { AppComponent } from './app.component';
import { TeacherInactivosComponent } from './admin/Usuarios/teacher-inactivos/teacher-inactivos.component';
import { TeacherEditComponent } from './forms/teacher-edit/teacher-edit.component';
import { StudentInactivosComponent } from './admin/Usuarios/student-inactivos/student-inactivos.component';
import { StudentComponent } from './admin/Usuarios/student/student.component';
import { CourseComponent } from './admin/Usuarios/course/course.component';

const routes: Routes = [

  {path: 'Teacher/for', component: TeacherFormComponent},
  {path: 'Teacher/for/:id', component: TeacherFormComponent},
  {path: '', redirectTo: '/Teacher', pathMatch: 'full'},
  {
    path: 'Teacher',
    component: TeacherComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'Home',
    component: HomeComponent,
  },
  {
    path: 'Footer',
    component: FooterComponent,
  },
  {
    path: 'App',
    component: AppComponent,
  },
  {
    path: 'Inactivos',
    component: TeacherInactivosComponent,
  },
  {
    path: 'Student-i',
    component: StudentInactivosComponent,
  },
  {
    path: 'Student-a',
    component: StudentComponent,
  }, 
  {
    path: 'Course-a',
    component: CourseComponent,
  }, 
  {
  path: 'Edit',
  component: TeacherEditComponent,
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
