import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthServices } from '../../../core/services/auth/auth-services';
import { TicketServices } from '../../../core/services/tickets/ticket-services';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
  badgeType?: 'danger' | 'neutral';
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent {
  constructor(
    private authServices: AuthServices,
    private router: Router,
    private cd: ChangeDetectorRef,
    private ticketServices: TicketServices
  ) { }
  totalTickets: number = 0
  currentUser: any = {
    initials: '',
    name: '',
    role: ''
  };

  sidebarOpen = false;
  ngOnInit(): void {
    this.fetchTicketCount();
    this.authServices.UserDetails().subscribe({
      next: (res: any) => {
        console.log(res)

        const initials = res.fullName
          ? res.fullName
            .split(' ')
            .map((word: string) => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('')
          : '';

        this.currentUser = {
          name: res.fullName,
          role: res.role,
          initials: initials
        };
        this.cd.detectChanges();

        // console.log(this.currentUser);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  fetchTicketCount(): void {

    this.ticketServices.getTickets().subscribe({
      next: (data: any) => {
        this.totalTickets = data.length;
        this.cd.detectChanges();

        console.log(this.totalTickets);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }




  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }


  logout() {

    this.authServices.logout();
  }

}