import { AuthService } from '../auth/auth.service';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {NgForm} from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

constructor(private router:Router,private authService:AuthService){}

@ViewChild('f') signUpForm!:NgForm; 

signUpUser:{name:string,email:string,password:string}={
  name:'',
  email:'',
  password:''
}

isLoading:boolean=false
error:string='';
successMessage='';

onLoadLogin(){
  this.router.navigate(['/users/login'])
}

onSubmit(){

  if(!this.signUpForm.valid)return;

  const name =this.signUpUser.name;
  const email =this.signUpUser.email;
  const password =this.signUpUser.password;

  this.isLoading=true;

  this.authService.signUp(name,email,password).subscribe(
    {
      next:(response)=>{
        console.log(response)
        this.successMessage=response.message
        this.isLoading=false;
        this.router.navigate(['/users/login']);
      },
      error:(errorMessage)=>{
        this.error=errorMessage;
        this.isLoading=false;
    }
      }
  );

  this.signUpForm?.reset();
}

}
