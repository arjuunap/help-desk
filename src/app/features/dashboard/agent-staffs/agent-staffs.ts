import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthServices } from '../../../core/services/auth/auth-services';
import { AdminServices } from '../../../core/services/admin/admin-services';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department?: string;
  status?: string;
  avatar?: string;
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agent-staffs.html',
  styleUrls: ['./agent-staffs.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentStaffs implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchQuery = '';
  selectedRole: string | null = null;
  loading = true;

  expandedUserId: number | null = null;
  userDetails: any[] = [];
  loadingDetails = false;
  usernames: any[] = [];
  role: string = ''

  constructor(
    private userService: AuthServices,
    private adminServices: AdminServices,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.getRole()
    this.getStaffs()
  }

  getStaffs() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log('Staffs', data)
        this.filteredUsers = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  getRole() {
    this.role = this.userService.getRole();
    console.log('Role', this.role)
  }

  toggleUser(user: any) {

    if (this.expandedUserId === user.id) {
      this.expandedUserId = null;
      this.cdr.markForCheck();
      return;
    }

    this.userDetails = [];

    this.cdr.markForCheck();
    this.expandedUserId = user.id;

    this.loadingDetails = true;

    this.adminServices.getAgentStaffs(user.id).subscribe({
      next: (res) => {
        console.log('Details', res)
        this.userDetails = res;
        this.loadingDetails = false;

        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingDetails = false;
      }
    });

  }
  get uniqueRoles(): string[] {
    return [...new Set(this.users.map(u => u.role).filter(Boolean))].sort();
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const q = this.searchQuery.toLowerCase();
      const matchesSearch = q
        ? user.name?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q) ||
        user.department?.toLowerCase().includes(q)
        : true;
      const matchesRole = this.selectedRole
        ? user.role === this.selectedRole
        : true;
      return matchesSearch && matchesRole;
    });
  }

  selectRole(role: string | null): void {
    this.selectedRole = role;
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }

  getAvatarColor(name: string): string {
    const colors = ['#1d4ed8', '#2563eb', '#1e40af', '#3b82f6', '#1d4ed8', '#1e3a8a'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }
}