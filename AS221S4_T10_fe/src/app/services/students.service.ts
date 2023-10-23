import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IStudent } from '../interfaces/students.interface';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = 'http://localhost:8085/app/v1/students';

  constructor(private http: HttpClient) {}

  findAll(): Observable<IStudent[]> {
    return this.http.get<IStudent[]>(`${this.apiUrl}/activate`).pipe(
      catchError(this.handleError)
    );
  }

  getInactiveStudents(): Observable<IStudent[]> {
    const url = `${this.apiUrl}/deactivate`;
    return this.http.get<IStudent[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  addStudent(student: IStudent): Observable<IStudent> {
    return this.http.post<IStudent>(this.apiUrl, student).pipe(
      catchError(this.handleError)
    );
  }

  update(student: IStudent): Observable<IStudent> {
    const url = `${this.apiUrl}/students/${student.id_student}`;
    return this.http.put<IStudent>(url, student).pipe(
      catchError(this.handleError)
    );
  }

  updateStudent(id: number): Observable<void> {
    const url = `${this.apiUrl}/activate/${id}`;
    return this.http.put<void>(url, null).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    const url = `${this.apiUrl}/deactivate/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    // Aquí puedes agregar lógica para manejar errores, como mostrar mensajes de error o registrarlos.
    console.error('Error:', error);
    return throwError('Ocurrió un error. Por favor, inténtelo de nuevo.');
  }
}
