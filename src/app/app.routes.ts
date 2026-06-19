import { Routes } from '@angular/router';
import { Register } from './features/auth/register/register';
import { LoginComponent } from './features/auth/login/login';
import {MainLayoutComponent} from './features/dashboard/main-layout/main-layout';
import { CategoryList } from './features/dashboard/category/category';
import { Home } from './features/dashboard/home/home';
import { RegisterTicketComponent } from './features/dashboard/tickets/tickets';
import { TicketList } from './features/dashboard/ticket-list/ticket-list';
import { TicketDetailComponent } from './features/dashboard/ticket-view/ticket-view';


export const routes: Routes = [
    {path: '',redirectTo:'register',pathMatch : 'full'},
    {path: 'register',component : Register},
    {path: 'login',component : LoginComponent},
    {path: 'main-layout',component : MainLayoutComponent,children:[
        {path : '',redirectTo:'home',pathMatch : 'full'},
        {path :'home',component : Home},
        {path :'categories',component : CategoryList},
        {path :'ticket-add',component : RegisterTicketComponent},
        {path :'ticket-list',component : TicketList},
        {path :'ticket-view/:ticketId',component : TicketDetailComponent},        
    ]}

];
