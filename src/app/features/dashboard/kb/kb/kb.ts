import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { KbArticlesService } from '../../../../core/services/kb/kb-articles-service';



interface CreateArticle {
  title: string;
  content: string;
  categoryId: number;
  author: string;
  published: boolean;
}

@Component({
  selector: 'app-kb-articles-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kb.html',
  styleUrls: ['./kb.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Kb implements OnInit {

  articles: any[] = [];
  filteredArticles: any[] = [];

  loading = true;

  searchQuery = '';

  selectedCategory: number | null = null;

  showModal = false;

  // Read Article Modal
  showReadModal = false;
  selectedArticle: any = null;
  readLoading = false;

 newArticle = {
  title: '',
  content: '',
  categoryId: 1,
  author: '',
  published: false,
  status: 'DRAFT'
};

  categoryLabels: Record<number, string> = {
    1: 'Account',
    2: 'Tickets',
    3: 'Software',
    4: 'Network',
    5: 'Hardware'
  };

  constructor(
    private articleService: KbArticlesService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {

    this.loading = true;

    this.articleService.getArticles().subscribe({

      next: (data: any[]) => {

        this.articles = data;
        console.log(this.articles)

        this.applyFilters();

        this.loading = false;

        this.cdr.markForCheck();

      },

      error: () => {

        this.loading = false;

        this.cdr.markForCheck();

      }

    });

  }

  get uniqueCategories(): number[] {

    return [...new Set(this.articles.map(x => x.categoryId))].sort();

  }

  applyFilters(): void {

    this.filteredArticles = this.articles.filter(article => {

      const matchesSearch = this.searchQuery
        ? article.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          article.content.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;

      const matchesCategory = this.selectedCategory === null
        ? true
        : article.categoryId === this.selectedCategory;

      return matchesSearch && matchesCategory;

    });

    this.cdr.markForCheck();

  }

  onSearch(): void {

    this.applyFilters();

  }

  selectCategory(category: number | null): void {

    this.selectedCategory = category;

    this.applyFilters();

  }

  getCategoryLabel(id: number): string {

    return this.categoryLabels[id] || 'Unknown';

  }

  getContentPreview(content: string): string {

    const plain = content
      .replace(/[#\-*\d\.]/g, '')
      .replace(/\n/g, ' ')
      .trim();

    return plain.length > 120
      ? plain.substring(0, 120) + '...'
      : plain;

  }

  openModal(): void {

    this.newArticle = {
    title: '',
    content: '',
    categoryId: 1,
    author: '',
    published: false,
    status: 'DRAFT'
  };

    this.showModal = true;

    this.cdr.markForCheck();

  }

  closeModal(): void {

    this.showModal = false;

    this.cdr.markForCheck();

  }

  saveArticle(): void {

    if (
      !this.newArticle.title.trim() ||
      !this.newArticle.content.trim() ||
      !this.newArticle.author.trim()
    ) {

      alert('Please fill all fields.');

      return;

    }
    console.log("Payload:", this.newArticle);

    this.articleService.createArticles(this.newArticle).subscribe({

      next: () => {

        console.log("new data",this.newArticle)
        this.closeModal();

        this.loadArticles();
        this.cdr.markForCheck();

      },

      error: err => {

        console.error(err);

        alert('Unable to create article.');

      }

    });

  }

  readArticle(id: number): void {
    console.log('id',id)

    this.showReadModal = true;
    this.readLoading = true;
    this.selectedArticle = null;
    this.cdr.markForCheck();

    this.articleService.readArticle(id).subscribe({
      next: (data: any) => {
        this.selectedArticle = data;
        this.readLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.readLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  closeReadModal(): void {
    this.showReadModal = false;
    this.selectedArticle = null;
    this.cdr.markForCheck();
  }

}