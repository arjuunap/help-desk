import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketServices } from '../../../core/services/tickets/ticket-services';
import { TicketAttachment } from '../../../core/models/ticket';
import { Router } from '@angular/router';
import { environment } from '../../../environment/environment';
import { FormsModule } from '@angular/forms';


// Prefix for relative attachment fileUrl values returned by the backend.
// Update this to match your Spring Boot static file serving base URL.
const FILE_BASE_URL = environment.filePath;

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.css'
})
export class TicketList implements OnInit {
  tickets: any[] = [];
  loading = false;
  errorMessage = '';

  filteredTickets: any[] = [];
  searchTerm: string = '';
  

  isAttachmentModalOpen = false;
  activeAttachmentImages: { url: string; name: string }[] = [];
  activeTicketNo = '';

  constructor(private ticketService: TicketServices,
    private cd: ChangeDetectorRef,
    private router: Router
    
    
  ) {}

  ngOnInit(): void {
    this.fetchTickets();
  }

  fetchTickets(): void {
    
    this.loading = true;
    this.errorMessage = '';

    this.ticketService.getTickets().subscribe({
      next: (data) => {
        this.tickets = data;
        this.filteredTickets = [...this.tickets];
        console.log('Tickets loaded:', this.tickets);
        this.cd.markForCheck();
        
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load tickets. Please try again.';
        this.loading = false;
      }
    });
  }

  getCategoryDisplay(ticket: any): string {
    const parentName = ticket.category.parentCategory?.name;
    return parentName ? `${parentName} / ${ticket.category.name}` : ticket.category.name;
  }

  getPriorityClass(priority: string): string {
    return `badge priority-${priority.toLowerCase()}`;
  }

  getStatusClass(status: string): string {
    return `badge status-${status.toLowerCase()}`;
  }

  isSlaOverdue(slaDueAt: string, slaBreached: boolean): boolean {
    if (slaBreached) {
      return true;
    }
    return new Date(slaDueAt).getTime() < Date.now();
  }

  formatSlaDate(slaDueAt: string): string {
    const date = new Date(slaDueAt);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }



  trackByTicketId(index: number, ticket: any): number {
    return ticket.ticketId;
  }

  isImageAttachment(attachment: TicketAttachment): boolean {
    return attachment.mimeType.startsWith('image/');
  }

  resolveFileUrl(fileUrl: string): string {
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      return fileUrl;
    }
    return `${FILE_BASE_URL}${fileUrl}`;
  }

  filterTickets() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      // If search is empty, show all tickets
      this.filteredTickets = [...this.tickets];
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();

    this.filteredTickets = this.tickets.filter(ticket => {
      // Safely check properties, converting them to strings/lowercase
      const idMatch = ticket.ticketNo?.toString().toLowerCase().includes(term);
      const subjectMatch = ticket.subject?.toLowerCase().includes(term);
      const descMatch = ticket.description?.toLowerCase().includes(term);
      
      // Returns true if ANY of the conditions match
      return idMatch || subjectMatch || descMatch;
    });
  }

  openAttachmentModal(ticket: any): void {
    const imageAttachments = ticket.attachments.filter((a:any) => this.isImageAttachment(a));

    this.activeAttachmentImages = imageAttachments.map((a:any) => ({
      url: this.resolveFileUrl(a.fileUrl),
      name: a.fileName
    }));
    this.activeTicketNo = ticket.ticketNo;
    this.isAttachmentModalOpen = true;
  }

  closeAttachmentModal(): void {
    this.isAttachmentModalOpen = false;
    this.activeAttachmentImages = [];
    this.activeTicketNo = '';
  }
  
  addTicket(): void {
    this.router.navigate(['/main-layout/ticket-add']);
    
}
  viewTicketDetails(ticketId: number): void {
  console.log('Ticket ID:', ticketId);
  this.router.navigate(['/main-layout/ticket-view', ticketId]);
}
}