import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthServices } from '../../../core/services/auth/auth-services';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  constructor(private router: Router,
    private authService: AuthServices
  ) { }

  ngOnInit(): void {
    // this.authService.UserDetails().subscribe((res) => {
    //   console.log(res);
    // })
  }
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  errorMsg = '';
  successMsg = '';


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

  onSubmit() {
    if (this.loginForm.invalid) return;


    const { email, password } = this.loginForm.value;


    this.authService.userLogin({ email, password }).subscribe({
      next: (res: any) => {
        this.successMsg = 'Logged in successfully!';
        localStorage.setItem('token', res.token);
        this.router.navigate(['/main-layout']);
        console.log('Token stored in localStorage:', localStorage.getItem('token'));
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMsg = err?.error?.message || 'Login failed';
        this.successMsg = '';
      }
    });
  }




}