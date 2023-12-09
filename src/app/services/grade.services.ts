import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Grade } from '../models/grade.model';

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  private urlGrades: string = 'http://localhost:8085/app/v1/grades';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getGrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(this.urlGrades);
  }

  create(grade: Grade): Observable<Grade> {
    return this.http.post<Grade>(this.urlGrades, grade, { headers: this.httpHeaders });
  }

  getGrade(id: number): Observable<Grade> {
    return this.http.get<Grade>(`${this.urlGrades}/${id}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlGrades}/${id}`, { headers: this.httpHeaders });
  }

  update(grade: Grade): Observable<Grade> {
    return this.http.put<Grade>(`${this.urlGrades}/${grade.idGrade}`, grade, { headers: this.httpHeaders });
  }

  deleteDeactivate(id: number): Observable<any> {
    const url = `${this.urlGrades}/deactivate/${id}`;
    return this.http.delete(url, { headers: this.httpHeaders });
  }

  restoreGrade(id: number): Observable<any> {
    const url = `${this.urlGrades}/activate/${id}`;
    return this.http.put(url, null, { headers: this.httpHeaders });
  }

  getInactiveGrades(): Observable<Grade[]> {
    return this.getGrades().pipe(
      map(grades => grades.filter(grade => grade.stateGrade === 'I'))
    );
  }
}
