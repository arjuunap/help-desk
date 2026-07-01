import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthServices } from '../../../core/services/auth/auth-services';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile {

  constructor(
    private profileService: AuthServices,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      phoneNumber: ['', Validators.required],
    });
  }

  profile: any = null;
  profileForm: FormGroup;
  isEditing = false;
  isLoading = true;
  isSaving = false;
  statusMessage = '';
  statusType: 'success' | 'error' | '' = '';

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile(): void {
    this.isLoading = true;
    this.profileService.fetchProfile().subscribe({
      next: (data: any) => {
        this.profile = data;
        this.profileForm.patchValue({
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
        });
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  get initials(): string {
    if (!this.profile?.fullName) return '';
    return this.profile.fullName
      .split(' ')
      .filter((part: string) => part.length > 0)
      .slice(0, 2)
      .map((part: string) => part[0].toUpperCase())
      .join('');
  }

  startEdit(): void {
    this.isEditing = true;
    this.statusMessage = '';
    this.profileForm.patchValue({
      fullName: this.profile.fullName,
      phoneNumber: this.profile.phoneNumber,
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.profileForm.patchValue({
      fullName: this.profile.fullName,
      phoneNumber: this.profile.phoneNumber,
    });
  }

  saveChanges(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const updatedData = {
      fullName: this.profileForm.get('fullName')?.value,
      phoneNumber: this.profileForm.get('phoneNumber')?.value,
    };

    this.profileService.updateProfile(updatedData).subscribe({
      next: (data: any) => {
        this.profile = { ...this.profile, ...updatedData };
        this.isEditing = false;
        this.isSaving = false;
        this.statusMessage = 'Profile updated successfully.';
        this.statusType = 'success';
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.isSaving = false;
        this.statusMessage = 'Failed to update profile. Please try again.';
        this.statusType = 'error';
        this.cd.detectChanges();
      }
    });
  }
}