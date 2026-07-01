import { Routes } from '@angular/router';
import { Register } from './features/auth/register/register';
import { LoginComponent } from './features/auth/login/login';
import {MainLayoutComponent} from './features/dashboard/main-layout/main-layout';
import { CategoryList } from './features/dashboard/category/category';
import { Home } from './features/dashboard/home/home';
import { RegisterTicketComponent } from './features/dashboard/tickets/tickets';
import { TicketList } from './features/dashboard/ticket-list/ticket-list';
import { TicketDetailComponent } from './features/dashboard/ticket-view/ticket-view';
import { DepartmentListComponent } from './features/dashboard/departments/departments';
import { SlaListComponent } from './features/dashboard/slas/slas';
import { AgentStaffs } from './features/dashboard/agent-staffs/agent-staffs';
import { RegisterAgentStaff } from './features/dashboard/add-agent-staff/add-agent-staff';
import { Kb } from './features/dashboard/kb/kb/kb';
import { Profile } from './features/dashboard/profile/profile';


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
        {path: 'departments',component : DepartmentListComponent} ,
        {path : 'slas',component : SlaListComponent}  ,
        {path : 'get-agent-staffs',component: AgentStaffs} ,
        {path :'add-agent-staff',component : RegisterAgentStaff},
        {path : 'kb',component : Kb},
        {path : 'profile',component : Profile}
    ]}

];
