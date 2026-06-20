import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthServices } from '../../../core/services/auth/auth-services';

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
    private cd : ChangeDetectorRef
  ) { }
  currentUser :any = {
    initials: '',
    name: '',
    role: ''
  };
  ngOnInit(): void {
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

      console.log(this.currentUser);
    },
    error: (err) => {
      console.error(err);
    }
  });
}

 

  

  logout() {

    this.authServices.logout();
  }
  
}