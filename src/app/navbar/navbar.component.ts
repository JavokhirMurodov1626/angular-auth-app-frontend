import { Subscription, Observable } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit,OnDestroy {

  authObs:Subscription;

  constructor(private authservice:AuthService){

    this.authObs= this.authservice.user.subscribe(user=>{
      this.isAuthenticated=(user.email && user.token)?true:false;
    })  
    
  }

  isAuthenticated=false;
  
  ngOnInit(): void {

  }
  logOut(){
    this.authservice.logOut();
  }
  ngOnDestroy(): void {
      this.authObs.unsubscribe();
  }
}
