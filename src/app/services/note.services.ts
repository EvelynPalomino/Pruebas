import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Note } from '../models/note.model'; 

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private urlNotes: string = 'http://localhost:8085/app/v1/notes';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.urlNotes);
  }

  

  create(note: Note): Observable<Note> {
    return this.http.post<Note>(this.urlNotes, note, { headers: this.httpHeaders });
  }

  getNote(id: number): Observable<Note> {
    return this.http.get<Note>(`${this.urlNotes}/${id}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlNotes}/${id}`, { headers: this.httpHeaders });
  }

  update(note: Note): Observable<Note> {
    return this.http.put<Note>(`${this.urlNotes}/${note.id_note}`, note, { headers: this.httpHeaders });
  }

}
