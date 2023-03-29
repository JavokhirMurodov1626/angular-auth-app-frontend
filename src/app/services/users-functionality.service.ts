import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, catchError } from 'rxjs';

@Injectable({providedIn:'root'})

export class UserFunctionsService{
    constructor(private http:HttpClient ){}
    
    blockSelected(usersIds:number[]){
        return this.http.post('http://localhost:5000/users/block',
        {
            usersIds
        }
        ).pipe(catchError(this.errorHandle))
    }

    unblockSelected(usersIds:number[]){
        return this.http.post('http://localhost:5000/users/unblock',
        {
            usersIds
        }
        ).pipe(catchError(this.errorHandle))
    }

    deleteUsers(usersIds:number[]){
        return this.http.post('http://localhost:5000/users/delete',
        {
            usersIds
        }
        ).pipe(catchError(this.errorHandle))
    }

    private errorHandle(err:HttpErrorResponse){

        let errorMessage='Unknown error occured!';
  
        if(!err.error || !err.error.error) return throwError(errorMessage);
  
        errorMessage=err.error.error;
  
        return throwError(errorMessage);
      }
}