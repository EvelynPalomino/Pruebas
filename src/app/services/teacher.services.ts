import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Teacher } from '../models/teacher.model';
import { Observable } from "rxjs/internal/Observable";
import { map } from "rxjs/internal/operators/map";

@Injectable()
export class TeacherServices {
  createOrUpdate(teacher: Teacher, isCreate: boolean) {
    throw new Error('Method not implemented.');
  }
    private urlNotesedu: string = 'http://localhost:8080/v1/teachers'
    private httpHeaders = new HttpHeaders({'Content-Type' : 'application/json'})

constructor(
  private http: HttpClient,
  // private router: Router
  ){}

  getTeachers(): Observable<Teacher[]> {
    return this.http.get(this.urlNotesedu).pipe(
      map( (response) => response as Teacher[] )
    );
  }
  create(teacher: Teacher) : Observable<Teacher>{
    return this.http.post<Teacher>(this.urlNotesedu, teacher, {headers:this.httpHeaders})
  }
  getTeacher(id: number): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.urlNotesedu}/${id}`);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlNotesedu}/${id}`, { headers: this.httpHeaders });
  }
  update(teacher: Teacher): Observable<Teacher> {
    return this.http.put(`${this.urlNotesedu}/${teacher.id}`, Teacher, { headers: this.httpHeaders })
      .pipe(
        map((response) => response as Teacher)
      );
  }

  deleteDesactivate(id: number): Observable<any> {
    const url = `${this.urlNotesedu}/deactivate/${id}`;
    return this.http.delete(url, { headers: this.httpHeaders });
  }

  restoreTeacher(id: number): Observable<any> {
    const url = `${this.urlNotesedu}/activate/${id}`;
    return this.http.put(url, null,{ headers: this.httpHeaders });
  }

  getInactiveTeachers(): Observable<Teacher[]> {
    return this.getTeachers().pipe(
      map(teachers => teachers.filter(teacher => teacher.stateTeacher === 'I'))
    );

  }

}
