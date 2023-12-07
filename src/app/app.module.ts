import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OAuthModule } from 'angular-oauth2-oidc';
import { MatSelectModule } from '@angular/material/select';
import { AppComponent } from './app.component';
import { TeacherComponent } from './admin/Usuarios/teacher/TeacherComponent.1';
import { TeacherServices } from './services/teacher.services';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './admin/Pages/login/login.component';
import { TeacherFormComponent } from './forms/teacher-form/teacher-form.component';
import { TeacherInactivosComponent } from './admin/Usuarios/teacher-inactivos/teacher-inactivos.component';
import { TeacherEditComponent } from './forms/teacher-edit/teacher-edit.component';
import { ToastrModule } from 'ngx-toastr';
import { StudentComponent } from './admin/Usuarios/student/student.component';
import { StudentInactivosComponent } from './admin/Usuarios/student-inactivos/student-inactivos.component';
import { StudentFormComponent } from './forms/student-form/student-form.component';


@NgModule({
  declarations: [
    AppComponent,
    TeacherComponent,
    SidebarComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    TeacherFormComponent,
    TeacherInactivosComponent,
    TeacherEditComponent,
    StudentComponent,
    StudentInactivosComponent,
    StudentFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    OAuthModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    MatSelectModule,

  ],
  providers: [
    TeacherServices
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
