import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { DepartmentsServices } from '../../../core/services/departments/departments-services';
import { AuthServices } from '../../../core/services/auth/auth-services';
import { AdminServices } from '../../../core/services/admin/admin-services';


@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './departments.html',
  styleUrl: './departments.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentListComponent implements OnInit {

  departments: any[] = [];

  loading = false;
  error = '';

  showModal = false;
  isSubmitting = false;

  departmentForm!: FormGroup;
  selectedDepartment: any = null;
  showAssignModal = false;

  users: any[] = [];
  filteredUsers: any[] = [];

  searchTerm = '';

  constructor(
    private departmentService: DepartmentsServices,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private adminServices: AdminServices,
    private authServices : AuthServices
  ) { }

  ngOnInit(): void {
    this.departmentForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });

    this.loadDepartments();
  }
  openAssignModal(department: any): void {

    this.selectedDepartment = department;
    this.showAssignModal = true;

    this.authServices.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        console.log('users', res)
        this.filteredUsers = res;
        this.cdr.markForCheck();
      }
    });
  }

  closeAssignModal(): void {
    this.showAssignModal = false;
    this.selectedDepartment = null;
    this.searchTerm = '';
  }

  searchUsers(): void {

    const term = this.searchTerm.toLowerCase();

    this.filteredUsers = this.users.filter(user =>
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term)
    );
  }

  loadDepartments(): void {
    this.loading = true;

    this.departmentService.getDepartments().subscribe({
      next: (res) => {
        this.departments = res;
        console.log('department', res)
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Failed to load departments';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.departmentForm.reset();
  }

  submit(): void {

    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const payload = {
      name: this.departmentForm.value.name.trim(),
      description: this.departmentForm.value.description?.trim() || '',
      isActive: true
    };

    this.departmentService.createDepartment(payload).subscribe({
      next: (res) => {

        this.departments = [res, ...this.departments];

        this.isSubmitting = false;
        this.closeModal();

        this.cdr.markForCheck();
      },
      error: () => {
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }
  deleteDepartment(departmentId: any) {
    this.isSubmitting = true;
    // this.departmentService.deleteDepartment(departmentId).subscribe({
    //   next: (res) => {
    //     this.isSubmitting = false;
    //     this.cdr.markForCheck();
    //   },
    //   error: () => {
    //     this.isSubmitting = false;
    //     this.cdr.markForCheck();
    //   }
    // });
  }

  assignManager(userId: number): void {

    const departmentId = this.selectedDepartment.departmentId;

    this.departmentService
      .assignManager(departmentId, userId)
      .subscribe({
        next: () => {

          const user = this.users.find(
            x => x.id === userId
          );

          this.selectedDepartment.managerId = userId;
          this.selectedDepartment.managerName =
            user?.fullName || user?.name;

          this.closeAssignModal();

          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Assign manager failed', err);
        }
      });
  }
}