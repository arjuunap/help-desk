import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoryServices } from '../../../core/services/category/category-services';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category.html',
  styleUrl: './category.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryList implements OnInit {
  categories: any[] = [];
  isLoading = false;
  loadError = '';

  isModalOpen = false;
  isSubmitting = false;
  submitError = '';

  categoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryServices,
    private cdr: ChangeDetectorRef
  ) {
    this.categoryForm = this.fb.group({
      categoryType: ['MAIN'],
      parentId: [null],

      name: ['', [Validators.required, Validators.maxLength(60)]],

      description: ['', [Validators.required, Validators.maxLength(300)]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.loadError = '';
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        console.log(data)
        // this.categories = data.filter(category => category.parentId === null);
        this.categories = data.filter(
          (category: any) => category.parentCategory === null
        );
        console.log("cat", this.categories)
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loadError = 'Failed to load categories. Please try again.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  openModal(): void {
    this.categoryForm.reset();
    this.submitError = '';
    this.isModalOpen = true;
    this.cdr.markForCheck();
  }

  closeModal(): void {
    if (this.isSubmitting) {
      return;
    }
    this.isModalOpen = false;
    this.cdr.markForCheck();
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  get name() {
    return this.categoryForm.get('name');
  }

  get description() {
    return this.categoryForm.get('description');
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    const payload = {
      name: this.categoryForm.value.name.trim(),
      description: this.categoryForm.value.description.trim()
    };
    console.log(payload)

    this.categoryService.create(payload).subscribe({
      next: (created) => {
        this.categories = [created, ...this.categories];
        this.isSubmitting = false;
        this.isModalOpen = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.submitError = 'Failed to create category. Please try again.';
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }

  // deleteCategory(category: Category): void {
  //   const confirmed = confirm(`Delete "${category.name}"? This cannot be undone.`);
  //   if (!confirmed) {
  //     return;
  //   }

  //   this.categoryService.delete(category.id).subscribe({
  //     next: () => {
  //       this.categories = this.categories.filter(c => c.id !== category.id);
  //       this.cdr.markForCheck();
  //     },
  //     error: () => {
  //       alert('Failed to delete category. Please try again.');
  //     }
  //   });
  // }
}