import { Injectable } from '@angular/core';

import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {ToDo} from '../models/to-do';

@Injectable()
export class ToDoService {
  constructor(
    private http: HttpClient
  ) { }

  path = 'https://jsonplaceholder.typicode.com/todos'

  getToDos():Observable<ToDo[]>{
    return this.http
      .get<ToDo[]>(this.path).pipe(
        tap(data=>console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );

  }



  handleError(err: HttpErrorResponse) {

    let errorMessage= ''
    if(err.error instanceof ErrorEvent){
      errorMessage = 'Bir Hata Oluştu'+err.error.message
    }else {
      errorMessage ='Sistemsel Hata'
    }
    return throwError(errorMessage);

  }

  addToDo(toDo: ToDo):Observable<ToDo> {
    return this.http.post<ToDo>(
      this.path,
      toDo,
      {
        headers:new HttpHeaders({
          'Content-Type':'application/json'
        })
      });
  }


  deleteToDo(id){
    return this.http.delete(this.path + '/' + id);
  }


}
