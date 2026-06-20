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
  ReactiveFormsModule
} from '@angular/forms';
import { DepartmentsServices } from '../../../core/services/departments/departments-services';


@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

  constructor(
    private departmentService: DepartmentsServices,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.departmentForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });

    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading = true;

    this.departmentService.getDepartments().subscribe({
      next: (res) => {
        this.departments = res;
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
  deleteDepartment(departmentId: any){
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
}