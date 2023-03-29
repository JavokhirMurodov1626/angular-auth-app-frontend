import { Router } from '@angular/router';
import { User } from './user.model';
import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { BehaviorSubject, catchError,tap,throwError } from 'rxjs';

interface AuthResponse{
  id:number,
  email:string,
  token:string,
  expiresIn:string;
  message:string,
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private tokenExpirationTimer:any;

  user =new BehaviorSubject<User>(new User(0,'', '', ''));

  constructor(private http:HttpClient,private router:Router) {}

 signUp(name:string,email:string,password:string){
    return this.http.post<AuthResponse>('http://localhost:5000/users/register',
    {
      name,  
      email,
      password
    }).pipe(
      catchError(this.errorHandle))
  }

  login(email:string, password:string){

    return this.http.post<AuthResponse>('http://localhost:5000/users/login',
    {
      email,
      password
    }).pipe(
      catchError(this.errorHandle),
      tap((resData)=>{
        this.handleAuthentication(resData.id,resData.email,resData.token,resData.expiresIn);
      })
      )
  }

  autoLogIn(){

    const userDataString = localStorage.getItem('userData');

    const userData:{
      id:number,
      email:string,
      _token:string,
      _tokenExpirationDate:string
    } = userDataString ? JSON.parse(userDataString) : null;

    if(!userData) return;

    const expirationDuration= new Date(userData._tokenExpirationDate).getTime()-new Date().getTime();

    this.autoLogOut(expirationDuration);

    const loggedUser=new User(
      userData.id,
      userData.email,
      userData._token,
      new Date(userData._tokenExpirationDate)
      )
    
    this.user.next(loggedUser);

  }

  logOut(){
    this.user.next(new User(0,'', '', ''));
    this.router.navigate(['/users/login']);
    localStorage.removeItem('userData');

    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer=null;
  }

  autoLogOut(expirationDuration:number){

    this.tokenExpirationTimer=setTimeout(()=>{
      this.logOut()
    },expirationDuration);

  }

// error handler for auth 
  private errorHandle(err:HttpErrorResponse){

      let errorMessage='Unknown error occured!';

      if(!err.error || !err.error.error) return throwError(errorMessage);

      errorMessage=err.error.error;

      return throwError(errorMessage);
    }

  // handling auth
  private handleAuthentication(id:number,email:string, token:string, expiresIn:string){

    const tokenExpirationDate = new Date(new Date().getTime() + +expiresIn*1000)

    const user=new User(id,email,token,tokenExpirationDate);

    this.user.next(user);

    this.autoLogOut(+expiresIn*1000);

    localStorage.setItem('userData',JSON.stringify(user));
  }

}
