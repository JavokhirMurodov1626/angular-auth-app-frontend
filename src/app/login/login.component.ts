import { Router } from '@angular/router';
import { AuthService } from './../auth/auth.service';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private authservice:AuthService,private router:Router){}

  loginUser:{email:string,password:string}={
    email:'',
    password:''
  }

  isLoading=false;
  error='';
  message=''

onSubmit(loginForm:NgForm){
  const email=this.loginUser.email;
  const password=this.loginUser.password;
  this.isLoading=true;
  this.authservice.login(email, password).subscribe({
    next:(response)=>{
      console.log(response);
      this.isLoading=false;
      this.router.navigate(['/users']);
    },
    error:(error)=>{
      this.error=error
      this.isLoading=false;
    }
  })

  loginForm?.reset();
}
}
