import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private urlNotesedu: string = 'http://localhost:8085/app/v1/students';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  checkIfExists(cellPhone: string, email: string): Observable<any> {
    return this.http.post<any>(`${this.urlNotesedu}/checkIfExists`, { cellPhone, email });
  }
  

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.urlNotesedu);
  }

  create(student: Student): Observable<Student> {
    return this.http.post<Student>(this.urlNotesedu, student, { headers: this.httpHeaders });
  }

  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.urlNotesedu}/${id}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlNotesedu}/${id}`, { headers: this.httpHeaders });
  }

  update(student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.urlNotesedu}/${student.id}`, student, { headers: this.httpHeaders });
  }

  deleteDeactivate(id: number): Observable<any> {
    const url = `${this.urlNotesedu}/deactivate/${id}`;
    return this.http.delete(url, { headers: this.httpHeaders });
  }

  restoreStudent(id: number): Observable<any> {
    const url = `${this.urlNotesedu}/activate/${id}`;
    return this.http.put(url, null, { headers: this.httpHeaders });
  }

  getInactiveStudents(): Observable<Student[]> {
    return this.getStudents().pipe(
      map(students => students.filter(student => student.state === 'I'))
    );
  }
}
