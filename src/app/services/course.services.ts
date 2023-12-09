import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private urlCourses: string = 'http://localhost:8085/app/v1/courses';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.urlCourses);
  }

  create(course: Course): Observable<Course> {
    return this.http.post<Course>(this.urlCourses, course, { headers: this.httpHeaders });
  }

  getCourse(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.urlCourses}/${id}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlCourses}/${id}`, { headers: this.httpHeaders });
  }

  update(course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.urlCourses}/${course.idCourse}`, course, { headers: this.httpHeaders });
  }

  deleteDeactivate(id: number): Observable<any> {
    const url = `${this.urlCourses}/deactivate/${id}`;
    return this.http.delete(url, { headers: this.httpHeaders });
  }

  restoreCourse(id: number): Observable<any> {
    const url = `${this.urlCourses}/activate/${id}`;
    return this.http.put(url, null, { headers: this.httpHeaders });
  }

  getInactiveCourses(): Observable<Course[]> {
    return this.getCourses().pipe(
      map(courses => courses.filter(course => course.stateCourse === 'I'))
    );
  }
}
