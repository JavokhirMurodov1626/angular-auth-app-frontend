
import { AuthService } from './auth.service';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable()

export class AuthInteceptorService implements HttpInterceptor{

    constructor(private authservice:AuthService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return this.authservice.user.pipe(

            take(1),

            exhaustMap((user)=>{
                if(req.url!=='http://localhost:5000/users'){
                    return next.handle(req);
                }
                
                const token=user.token;

                const headers=new HttpHeaders().set('Authorization',`Bearer ${token}`);

                const modifiedReq=req.clone({headers})

                return next.handle(modifiedReq) 
            })
            )
       
    }
}