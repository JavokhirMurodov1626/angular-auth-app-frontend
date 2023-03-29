import { AuthGuard } from './auth/auth.guard'; 
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {path:'',component:HomeComponent},
    {path:'users',component:DashboardComponent,canActivate:[AuthGuard]},
    {path:'users/login',component:LoginComponent},
    {path:'users/register',component:RegisterComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
