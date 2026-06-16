import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  constructor(private router: Router) { }


  showPassword = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
  goToRegister() {

    this.router.navigate(['/register']);
  }

}