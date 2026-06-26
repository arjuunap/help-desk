import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KbArticlesService } from '../../../../core/services/kb/kb-articles-service';

interface Article {
  author: string;
  categoryId: number;
  content: string;
  published: boolean;
  tags: string[] | null;
  title: string;
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
  articles: Article[] = [];
  filteredArticles: Article[] = [];
  searchQuery = '';
  selectedCategory: number | null = null;
  loading = true;

  categoryLabels: Record<number, string> = {
    1: 'Account',
    2: 'Tickets',
    3: 'Software',
    4: 'Network',
    5: 'Hardware'
  };

  constructor(
    private articleService: KbArticlesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.articleService.getArticles().subscribe({
      next: (data: any) => {
        console.log("data",data)
        this.articles = data;
        this.filteredArticles = data;
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
    return [...new Set(this.articles.map(a => a.categoryId))].sort();
  }

  applyFilters(): void {
    this.filteredArticles = this.articles.filter(article => {
      const matchesSearch = this.searchQuery
        ? article.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          article.content.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;
      const matchesCategory = this.selectedCategory !== null
        ? article.categoryId === this.selectedCategory
        : true;
      return matchesSearch && matchesCategory;
    });
  }

  selectCategory(id: number | null): void {
    this.selectedCategory = id;
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

  getCategoryLabel(id: number): string {
    return this.categoryLabels[id] ?? `Category ${id}`;
  }

  getContentPreview(content: string): string {
    const plain = content.replace(/[#\-*\d\.]/g, '').replace(/\n+/g, ' ').trim();
    return plain.length > 120 ? plain.slice(0, 120) + '…' : plain;
  }
}