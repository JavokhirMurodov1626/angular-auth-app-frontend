import { AuthService } from '../auth/auth.service';
import { UsersService } from '../services/users.service';
import { Component,ElementRef,OnInit, ViewChild } from '@angular/core';
import {AllUser} from '../services/users.service';
import { User } from '../auth/user.model';
import { UserFunctionsService } from '../services/users-functionality.service';
import {take,map,tap} from 'rxjs/operators'


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

constructor(
  private usersService:UsersService,
  private functionsService:UserFunctionsService,
  private authservice:AuthService,
  ){}

users:AllUser[]=[];

@ViewChild('selectAll',{static:false}) allSelected!:ElementRef;

error='';


ngOnInit(){

  this.usersService.getUsers().subscribe({

    next:(users:AllUser[])=>{
      this.users=users
    },

    error:(errorMessage:string)=>{
      this.error=errorMessage;
    }
  })

 
}

selectAllRows(checked: boolean) {

  this.users.forEach(user => user.is_selected = checked);

}

getCurrentUserId(){
  const userDataString = localStorage.getItem('userData');

  const userData:{
    id:number,
    email:string,
    _token:string,
    _tokenExpirationDate:string
  } = userDataString ? JSON.parse(userDataString) : null;

  return userData.id
}

blockSelected() {
  //getting selected users
  const usersIds = this.users.filter(user => user.is_selected).map(user=>user.id);
  //getting current user id

  
  //passing selected users to service block function
  this.functionsService.blockSelected(usersIds).subscribe({

    next:(res)=>{

      //if current user is included in the list of selected, logout the current user
      let currentUserId=this.getCurrentUserId()

      if(usersIds.includes(currentUserId)){
        this.authservice.logOut();
      }

      //if response is successfull updating selected users from IU
      this.users.forEach(user => {
        if (usersIds.includes(user.id) && user.status!=='blocked') {
          user.status = 'blocked';
          user.is_selected=false;
        }
        //if all users are selected, returning users'checked to default state
        if(this.allSelected.nativeElement.checked){
          this.allSelected.nativeElement.checked=false;
          this.selectAllRows(false);
        }
      });
    },

    error:(errorMessage)=>{
      if(errorMessage){

        this.error=errorMessage;
        //if response is unsuccessfull return previous UI
        this.users.forEach(user => {
          if (usersIds.includes(user.id)) {
            user.status = 'active';
          }
        });
      }
    }

  })

}

unblockSelected() {

  const usersIds = this.users.filter(user => user.is_selected).map(user=>user.id);

  this.functionsService. unblockSelected(usersIds).subscribe({

    next:(res)=>{
      this.users.forEach(user => {
        if (usersIds.includes(user.id) && user.status!=='active') {
          user.status = 'active';
          user.is_selected=false;
        }

         //if all users are selected, returning users'checked to default state
         if(this.allSelected.nativeElement.checked){
          this.allSelected.nativeElement.checked=false;
          this.selectAllRows(false);
        }

      });
    },

    error:(errorMessage)=>{

      this.error=errorMessage;

      this.users.forEach(user => {
        if (usersIds.includes(user.id)) {
          user.status = 'blocked';
        }

      });
    }

  })
}

deleteSelected() {
  const usersIds = this.users.filter(user => user.is_selected).map(user=>user.id);

  const fixedUsers=[...this.users];

  const filteredUsers=this.users.filter(user => !usersIds.includes(user.id));

  this.functionsService.deleteUsers(usersIds).subscribe({

    next:(res)=>{
      //if current user is included in the list of selected, logout the current user
      let currentUserId=this.getCurrentUserId()
      
      if(usersIds.includes(currentUserId)){
        this.authservice.logOut();
      }
      
      this.users=filteredUsers;

       //if all users are selected, returning users'checked to default state
       if(this.allSelected.nativeElement.checked){
        this.allSelected.nativeElement.checked=false;
        this.selectAllRows(false);
      }
    },

    error:(errorMessage)=>{
      this.error=errorMessage;
      this.users=fixedUsers;
    }
  })
}
}
