import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServices } from '../../../core/services/auth/auth-services';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {

  registerForm!: FormGroup;

  showPassword = false;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthServices,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role:['']
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue = this.registerForm.value;

    if (formValue.password !== formValue.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    const payload = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber,
      password: formValue.password
      
    };

    this.isSubmitting = true;

    this.authService.registerUser(payload).subscribe({
      // this is a comment // 
      next: (res) => {
        console.log(res);

        alert('Registration Successful');

        this.registerForm.reset();

        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage =
          err?.error?.message || 'Registration failed';
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  googleLogin(): void {
    this.authService.googleLogin();
  }
}