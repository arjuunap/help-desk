import { Routes } from '@angular/router';
import { Register } from './features/auth/register/register';
import { LoginComponent } from './features/auth/login/login';

export const routes: Routes = [
    {path: '',redirectTo:'register',pathMatch : 'full'},
    {path: 'register',component : Register},
    {path: 'login',component : LoginComponent}

];
