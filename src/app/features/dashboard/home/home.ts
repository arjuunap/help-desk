import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketServices } from '../../../core/services/tickets/ticket-services';
import { Router } from '@angular/router';
import { AuthServices } from '../../../core/services/auth/auth-services';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home implements OnInit {

  tickets: any[] = [];
  filteredTickets: any[] = [];
  totalTickets: number = 0;

  loading = false;
  errorMessage = '';
  searchTerm = '';
  currentPage = 1;
  pageSize = 6;
  filteredLogs: any[] = [];
  totalLogs: number = 0;
  logs: any[] = [];
  loadingLogs = false;
  errorMessageLogs = '';
  selectedTicket: any = null;
showAssignModal = false;
assigneeId:number = 0
ticketId:number = 0

users: any[] = [];
filteredUsers: any[] = [];

  constructor(
    private ticketService: TicketServices,
    private cd: ChangeDetectorRef,
    private route: Router,
    private userServices : AuthServices
  ) { }

  ngOnInit(): void {
    this.fetchTickets();
    this.fetchLogs();
  }

  updateStatus(ticket: any, status: string): void {

  const oldStatus = ticket.status;

  ticket.status = status; // instant UI update

  this.ticketService
      .updateTicketStatus(ticket.ticketId, status)
      .subscribe({
        next: () => {
          this.cd.markForCheck();
        },
        error: () => {
          ticket.status = oldStatus; // revert if API fails
          this.cd.markForCheck();
        }
      });
}
  


openAssignModal(ticket: any): void {
  this.selectedTicket = ticket;
  this.showAssignModal = true;
  console.log('ticket',this.selectedTicket)

  this.userServices.getUsers().subscribe({
    next: (users) => {
      this.users = users;
      this.filteredUsers = users;
    }
  });
}

searchUsers(): void {
  const term = this.searchTerm.toLowerCase().trim();

  this.filteredUsers = this.users.filter(user =>
    user.name?.toLowerCase().includes(term) ||
    user.email?.toLowerCase().includes(term)
  );
}

assignAgent(userId: number): void {

  
    
    this.assigneeId = userId
    console.log(this.selectedTicket.ticketId,this.assigneeId)
    
  

  this.ticketService.assignAgent( this.selectedTicket.ticketId,
  this.assigneeId).subscribe({
    next: (res) => {
      console.log('sed',this.assigneeId,this.selectedTicket.ticketId)
       console.log('res',res)
      this.selectedTicket.assigneeId = userId;
      this.fetchTickets(); 
      const selectedUser = this.users.find(
        u => u.id === userId
      );
     
      this.cd.detectChanges();
      this.cd.markForCheck()

      this.selectedTicket.assigneeName = selectedUser?.name;

      this.closeAssignModal();
    }
  });
}


closeAssignModal(): void {
  this.showAssignModal = false;
  this.selectedTicket = null;
  this.searchTerm = '';
}

  fetchTickets(): void {

    this.loading = true;
    this.errorMessage = '';

    this.ticketService.getTickets().subscribe({
      next: (data) => {
        this.tickets = data;
        this.totalTickets = data.length;

        this.filteredTickets = [...data];

        this.currentPage = 1;

        this.loading = false;
        this.cd.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Failed to load tickets. Please try again.';
        this.loading = false;
        this.cd.markForCheck();
      }
    });
  }

  fetchLogs(): void {
    this.loading = true;
    this.errorMessage = '';

    this.ticketService.getLogs().subscribe({
      next: (data) => {
        this.logs = data;
        console.log('data',data)
        this.totalLogs = data.length;

        this.filteredLogs = [...data];

        this.currentPage = 1;

        this.loading = false;
        this.cd.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Failed to load logs. Please try again.';
        this.loading = false;
        this.cd.markForCheck();
      }
    });
  }

  addTicket(): void {
  this.route.navigate(['/main-layout/ticket-add']);
}


getActivityDotClass(action: string): string {

  switch (action?.toUpperCase()) {

    case 'CREATED':
      return 'dot-green';

    case 'ASSIGNED':
      return 'dot-blue';

    case 'UPDATED':
      return 'dot-purple';

    case 'RESOLVED':
      return 'dot-green';

    case 'CLOSED':
      return 'dot-orange';

    case 'ESCALATED':
      return 'dot-red';

    default:
      return 'dot-blue';
  }
}

  get paginatedTickets(): any[] {

    const start =
      (this.currentPage - 1) * this.pageSize;

    const end =
      start + this.pageSize;

    return this.filteredTickets.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(
      this.filteredTickets.length / this.pageSize
    );
  }

  changePage(page: number): void {

    if (
      page < 1 ||
      page > this.totalPages
    ) {
      return;
    }

    this.currentPage = page;
  }

  getPriorityClass(priority: string): string {
    switch (priority?.toUpperCase()) {
      case 'CRITICAL': return 'priority-critical';
      case 'HIGH': return 'priority-high';
      case 'MEDIUM': return 'priority-medium';
      case 'LOW': return 'priority-low';
      default: return '';
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'OPEN': return 'status-open';
      case 'IN_PROGRESS': return 'status-inprogress';
      case 'RESOLVED': return 'status-resolved';
      case 'CLOSED': return 'status-resolved';
      default: return '';
    }
  }

  getAssigneeName(ticket: any): string {
  return ticket.assignee?.fullName || 'Unassigned';
}

  getAssigneeInitials(ticket: any): string {

    if (!ticket.assigneeName) {
      return 'NA';
    }

    return ticket.assigneeName
      .split(' ')
      .map((x: string) => x[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getSlaText(ticket: any): string {

    if (ticket.slaBreached) {
      return 'Breached';
    }

    if (!ticket.slaDueAt) {
      return 'No SLA';
    }

    const diff =
      new Date(ticket.slaDueAt).getTime() - Date.now();

    const mins = Math.floor(diff / 60000);

    if (mins <= 0) {
      return 'Breached';
    }

    if (mins < 60) {
      return `${mins}m left`;
    }

    return `${Math.floor(mins / 60)}h left`;
  }

  getSlaClass(ticket: any): string {

    if (ticket.slaBreached) {
      return 'sla-breached';
    }

    const diff =
      new Date(ticket.slaDueAt).getTime() - Date.now();

    const mins = Math.floor(diff / 60000);

    if (mins <= 30) {
      return 'sla-danger';
    }

    if (mins <= 120) {
      return 'sla-warn';
    }

    return 'sla-ok';
  }

  getSlaProgress(ticket: any): number {

    if (ticket.slaBreached) {
      return 100;
    }

    const diff =
      new Date(ticket.slaDueAt).getTime() - Date.now();

    const mins = Math.floor(diff / 60000);

    if (mins <= 30) {
      return 90;
    }

    if (mins <= 120) {
      return 60;
    }

    return 25;
  }

  getTimeAgo(dateString: string): string {

    if (!dateString) {
      return '-';
    }

    const diff =
      Math.floor(
        (Date.now() - new Date(dateString).getTime()) / 1000
      );

    if (diff < 60) {
      return 'just now';
    }

    if (diff < 3600) {
      return `${Math.floor(diff / 60)}m ago`;
    }

    if (diff < 86400) {
      return `${Math.floor(diff / 3600)}h ago`;
    }

    return `${Math.floor(diff / 86400)}d ago`;
  }
}