import { AuthService } from './../auth/auth.service';
import { catchError, throwError } from 'rxjs';
import {  exhaustMap, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

export interface AllUser {
  id:number,
  name:string,
  email:string,
  last_login:Date,
  registration_time:Date,
  status:string,
  is_selected:boolean
}

@Injectable({
  providedIn: 'root'
})

export class UsersService {

  constructor(private http:HttpClient) { }
  
  getUsers(){

      return this.http.get<AllUser[]>('http://localhost:5000/users').pipe(catchError(err=>{

        let errorMessage='Unknown Error';

        if(!err.error || !err.error.error) return throwError(errorMessage);

        errorMessage=err.error.error;

        return throwError(errorMessage);
      })
    )
  }
}
