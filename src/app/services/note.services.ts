import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Note } from 'src/app/models/note.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private apiUrl = 'http://localhost:8085/app/v1/notes';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  findNoteById(id: number): Observable<Note> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Note>(url).pipe(
      catchError(this.handleError)
    );
  }

  addNote(note: Note): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, note).pipe(
      catchError((error) => {
        console.error('Error en la solicitud POST:', error);
        throw error; // Puedes lanzar el error nuevamente para que se propague
      })
    );
  }
  

  updateNote(note: Note): Observable<Note> {
    const url = `${this.apiUrl}/${note.id_note}`;
    return this.http.put<Note>(url, note).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    // Aquí puedes agregar lógica para manejar errores, como mostrar mensajes de error o registrarlos.
    console.error('Error:', error);
    return throwError('Ocurrió un error. Por favor, inténtelo de nuevo.');
  }
}