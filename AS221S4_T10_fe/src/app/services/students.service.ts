import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IStudent } from '../interfaces/students.interface';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = 'http://localhost:8085/app/v1/';

  constructor(private http: HttpClient) {}

  findAll(): Observable<IStudent[]> {
    return this.http.get<IStudent[]>(`${this.apiUrl+'students'}`).pipe(
      catchError(this.handleError)
    );
  }

  getInactiveStudents(): Observable<IStudent[]> {
    const url = `${this.apiUrl+'students'}/deactivate`;
    return this.http.get<IStudent[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  addStudent(student: IStudent): Observable<IStudent> {
    return this.http.post<IStudent>(this.apiUrl+'students', student).pipe(
      catchError(this.handleError)
    );
  }

  update(student: IStudent): Observable<IStudent> {
    const url = `${this.apiUrl+'students'}/${student.id_student}`;
    return this.http.put<IStudent>(url, student).pipe(
      catchError(this.handleError)
    );
  }

  updateStudent(id_student: number): Observable<void> {
    const url = `${this.apiUrl+'students'}/activate/${id_student}`;
    return this.http.put<void>(url, null).pipe(
      catchError(this.handleError)
    );
  }

  delete(id_student: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl+'students'}/deactivate/${id_student}`)
  }

  private handleError(error: any) {
    // Aquí puedes agregar lógica para manejar errores, como mostrar mensajes de error o registrarlos.
    console.error('Error:', error);
    return throwError('Ocurrió un error. Por favor, inténtelo de nuevo.');
  }
}
