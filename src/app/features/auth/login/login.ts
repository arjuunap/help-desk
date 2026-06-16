import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthServices } from '../../../core/services/auth/auth-services';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  constructor(private router: Router,
    private authService: AuthServices
  ) { }

  ngOnInit(): void {
    this.authService.UserDetails().subscribe((res) => {
      console.log(res);
    })
  }



  showPassword = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
  goToRegister() {

    this.router.navigate(['/register']);
  }

  googleLogin() {
    this.authService.googleLogin()
  }




}