// register-ticket.component.ts
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl
} from '@angular/forms';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Channel, Department, Priority, SlaPolicy, TicketSubmitPayload } from '../../../core/models/ticket';
import { TicketServices } from '../../../core/services/tickets/ticket-services';
import { DepartmentsServices } from '../../../core/services/departments/departments-services';
import { SlaPolicyServices } from '../../../core/services/sla-policy/sla-policy-services';
import { CategoryServices } from '../../../core/services/category/category-services';
import { ViewChild, ElementRef } from '@angular/core';


interface PriorityOption {
  value: Priority;
  label: string;
}

interface ChannelOption {
  value: Channel;
  label: string;
}

@Component({
  selector: 'app-register-ticket',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tickets.html',
  styleUrls: ['./tickets.css']
})
export class RegisterTicketComponent implements OnInit {
  ticketForm!: FormGroup;

  priorities: PriorityOption[] = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
    { value: 'CRITICAL', label: 'Critical' }
  ];

  channels: ChannelOption[] = [
    { value: 'WEB', label: 'Web' },
    { value: 'MOBILE', label: 'Mobile' },
    { value: 'EMAIL', label: 'Email' },
    { value: 'PHONE', label: 'Phone' },
    { value: 'WALK_IN', label: 'Walk-in' }
  ];

  @ViewChild('attachmentInput')
  attachmentInput!: ElementRef<HTMLInputElement>;

  selectedFiles: File[] = [];


  departments: Department[] = [];
  slaPolicies: SlaPolicy[] = [];
  categories: any[] = [];
  subCategories: any[] = [];
  selectedParentId: number | null = null;

  loadingDepartments = false;
  loadingSlaPolicies = false;
  loadingCategories = false;
  loadingMeta = false; // combined initial load flag

  submitting = false;
  submitError: string | null = null;
  submitSuccess = false;

  selectedCategoryId: number | null = null;

  parentCategories: any[] = [];

  selectedParent: any = null;
  selectedSubCategory: any = null;

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketServices,
    private cdr: ChangeDetectorRef,
    private departmentService: DepartmentsServices,
    private slaPolicyService: SlaPolicyServices,
    private categoryService: CategoryServices
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadMetadata();
  }

  private buildForm(): void {
    this.ticketForm = this.fb.group({
      subject: ['', [Validators.required, Validators.maxLength(120)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priority: ['', Validators.required],
      channel: ['', Validators.required],
      departmentId: [null, Validators.required],
      slaPolicyId: [null, Validators.required],
      categoryId: [null, Validators.required],
      attachments: [null]   // add this
    });
  }

  private loadMetadata(): void {
    this.loadingDepartments = true;
    this.loadingSlaPolicies = true;
    this.loadingCategories = true;
    this.loadingMeta = true;

    forkJoin({
      departments: this.departmentService.getDepartments(),
      slaPolicies: this.slaPolicyService.getSlaPolicies(),
      categories: this.categoryService.getCategories()
    })
      .pipe(
        finalize(() => {
          this.loadingDepartments = false;
          this.loadingSlaPolicies = false;
          this.loadingCategories = false;
          this.loadingMeta = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: ({ departments, slaPolicies, categories }) => {
          this.departments = departments;
          this.slaPolicies = slaPolicies;
          this.categories = categories;


          console.log("sdccdscsd", this.categories)

          this.parentCategories = categories.filter(
            (c: any) => c.parentCategory === null
          );


          console.log(this.categories, this.departments, this.slaPolicies)
          this.cdr.markForCheck();
        },
        error: () => {
          this.submitError = 'Failed to load form data. Please refresh and try again.';
          this.cdr.markForCheck();
        }
      });
  }

  onParentCategoryChange(parentId: number): void {

    this.selectedParentId = parentId;

    this.subCategories = this.categories.filter(
      (c: any) =>
        c.parentCategory &&
        c.parentCategory.categoryId === parentId
    );

    this.selectedSubCategory = null;

    this.ticketForm.patchValue({
      categoryId: null
    });

    this.cdr.markForCheck();
  }

  onSubCategoryChange(categoryId: number): void {

    this.selectedSubCategory = categoryId;

    this.ticketForm.patchValue({
      categoryId: categoryId
    });

    this.ticketForm.get('categoryId')?.markAsTouched();
  }

  isInvalid(controlName: string): boolean {
    const control = this.ticketForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getError(controlName: string): string {
    const control = this.ticketForm.get(controlName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'This field is required.';
    if (control.errors['minlength']) {
      return `Minimum ${control.errors['minlength'].requiredLength} characters required.`;
    }
    if (control.errors['maxlength']) {
      return `Maximum ${control.errors['maxlength'].requiredLength} characters allowed.`;
    }
    return 'Invalid value.';
  }

  get descriptionLength(): number {
    return (this.ticketForm.get('description')?.value || '').length;
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files) {
      return;
    }

    this.selectedFiles = Array.from(input.files);

    this.ticketForm.patchValue({
      attachments: this.selectedFiles
    });
  }

  onSubmit(): void {
    if (this.ticketForm.invalid || this.submitting) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.submitError = null;
    this.submitSuccess = false;

    const formValue = this.ticketForm.value;
    const payload: TicketSubmitPayload = {
      subject: formValue.subject.trim(),
      description: formValue.description.trim(),
      priority: formValue.priority,
      channel: formValue.channel,
      departmentId: formValue.departmentId,
      slaPolicyId: formValue.slaPolicyId,
      categoryId: formValue.categoryId
    };

    const formData = new FormData();

    formData.append(
      'data',
      new Blob(
        [JSON.stringify(payload)],
        { type: 'application/json' }
      )
    );

    this.selectedFiles.forEach(file => {
      formData.append('files', file);
    });


    this.ticketService
      .submitTicket(formData)
      .pipe(finalize(() => {
        this.submitting = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: (res) => {
          console.log(res)

          this.submitSuccess = true;
          this.resetForm();
        },
        error: (err) => {
          this.submitError = err?.error?.message || 'Failed to submit ticket. Please try again.';
        }
      });
  }

  resetForm(): void {

    this.ticketForm.reset({
      subject: '',
      description: '',
      priority: '',
      channel: '',
      departmentId: null,
      slaPolicyId: null,
      categoryId: null,
      attachments: null
    });

    this.selectedCategoryId = null;
    this.selectedFiles = [];

    if (this.attachmentInput) {
      this.attachmentInput.nativeElement.value = '';
    }

    this.cdr.markForCheck();
  }

  dismissSuccess(): void {
    this.submitSuccess = false;
  }

  dismissError(): void {
    this.submitError = null;
  }
}