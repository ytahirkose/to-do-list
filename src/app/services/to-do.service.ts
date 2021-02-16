import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {ToDo} from '../models/to-do';
import {environment} from '../../environments/environment';

@Injectable()
export class ToDoService {

  path = environment.paths.toDoPath;

  constructor(
    private http: HttpClient
  ) { }

  getToDos(): Observable<ToDo[]> {
    return this.http
      .get<ToDo[]>(this.path).pipe(
        tap(data => {
        }),
        catchError(this.handleError)
      );
  }

  handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = 'An Error' + err.error.message;
    } else {
      errorMessage = 'System Error';
    }
    return throwError(errorMessage);
  }

  addToDo(toDo: ToDo): Observable<ToDo> {
    return this.http.post<ToDo>(
      this.path,
      toDo,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
  }


  deleteToDo(id) {
    return this.http.delete(this.path + '/' + id);
  }

  editTodo(toDo: ToDo): Observable<ToDo> {
    return this.http.patch<ToDo>(
      this.path + '/' + toDo.id,
      {
        title: toDo.title,
        completed: toDo.completed
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
  }
}
