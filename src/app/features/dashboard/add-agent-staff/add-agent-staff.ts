import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminServices } from '../../../core/services/admin/admin-services';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './add-agent-staff.html',
  styleUrls: ['./add-agent-staff.css']
})
export class RegisterAgentStaff {

  registerForm: FormGroup;

  constructor(private fb: FormBuilder,
    private adminServices : AdminServices,
    private router : Router
  ) {

    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

  }

  register() {

    if (this.registerForm.invalid) return;

    console.log(this.registerForm.value);
    this.adminServices.createAgentStaff(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigate(['/main-layout/home']);
      }
    })

  }

}