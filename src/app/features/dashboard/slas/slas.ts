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

import { SlaPolicyServices } from '../../../core/services/sla-policy/sla-policy-services';

@Component({
  selector: 'app-sla-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './slas.html',
  styleUrl: './slas.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlaListComponent implements OnInit {

  slas: any[] = [];

  loading = false;
  error = '';

  showModal = false;
  isSubmitting = false;

  slaForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private slaService: SlaPolicyServices,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.slaForm = this.fb.group({
      name: ['', Validators.required],
      priorityLevel: ['LOW', Validators.required],
      description: [''],
      escalationEnabled: [true],
      escalationMinutes: [0, [Validators.required, Validators.min(0)]],
      responseMinutes: [0, [Validators.required, Validators.min(0)]],
      resolutionMinutes: [0, [Validators.required, Validators.min(0)]],
      active: [true]
    });

    this.loadSlas();
  }

  loadSlas(): void {

    this.loading = true;

    this.slaService.getSlaPolicies().subscribe({
      next: (res) => {
        this.slas = res;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Failed to load SLA policies';
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
    this.slaForm.reset({
      priorityLevel: 'LOW',
      escalationEnabled: true,
      escalationMinutes: 0,
      responseMinutes: 0,
      resolutionMinutes: 0,
      active: true
    });
  }

  submit(): void {

    if (this.slaForm.invalid) {
      this.slaForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const payload = {
      name: this.slaForm.value.name,
      priorityLevel: this.slaForm.value.priorityLevel,
      description: this.slaForm.value.description,
      escalateEnabled: this.slaForm.value.escalationEnabled,
      escalationMinutes: this.slaForm.value.escalationMinutes,
      responseMinutes: this.slaForm.value.responseMinutes,
      resolutionMinutes: this.slaForm.value.resolutionMinutes,
      isActive: this.slaForm.value.active
    };

    console.log(payload);

    this.slaService.createSla(payload).subscribe({
      next: (created) => {

        this.slas = [created, ...this.slas];

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
  // deleteSla(id: number): void {
  //   this.slaService.deleteSla(id).subscribe({
  //     next: () => {
  //       this.loadSlas();
  //       this.cdr.markForCheck();
  //     }
  //   });
  // }
}