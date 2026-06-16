import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServices } from '../../../core/services/auth/auth-services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  constructor(private router: Router,
    private authServices: AuthServices
  ) { }
  ngOnInit(): void {
    this.authServices.getUsers().subscribe((res) => {
      console.log(res);
    })  
  }

  showPassword = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  goToLogin() {

    this.router.navigate(['/login']);
  }
}
