
import { AuthService } from './auth.service';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take,map } from 'rxjs/operators';


@Injectable({providedIn:'root'})

export class AuthGuard implements CanActivate{

    constructor(private authservice:AuthService,private router:Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        
        return this.authservice.user.pipe( 
            take(1),
            map((user)=>{
                const isAuth=user.token ? true: false;
                if(isAuth){
                    return true;
                }
                return this.router.createUrlTree(['/users/login'])
        }))
    }
}