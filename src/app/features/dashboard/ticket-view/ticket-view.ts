import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketServices } from '../../../core/services/tickets/ticket-services';

export interface Comment {
  id: number;
  author: string;
  avatarInitials: string;
  avatarColor: string;
  text: string;
  postedAt: Date;
}

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ticket-view.html',
  styleUrl: './ticket-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketDetailComponent implements OnInit {

  ticket: any = null;
  loading = false;
  error = '';

  commentForm!: FormGroup;
  comments: Comment[] = [];
  myInitials = 'ME';
  myAvatarColor = '#2563eb';
  private nextCommentId = 1;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketServices,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.commentForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(3)]]
    });

    const ticketId = Number(this.route.snapshot.paramMap.get('ticketId'));
    if (ticketId) {
      this.fetchTicket(ticketId);
    }
  }

  

  fetchTicket(id: number): void {
    this.loading = true;
    this.error = '';
    this.ticketService.getTicketById(id).subscribe({
      next: (data) => {
        this.ticket = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = 'Failed to load ticket. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  submitComment(): void {
    if (this.commentForm.invalid) return;

    const newComment: Comment = {
      id: this.nextCommentId++,
      author: 'You',
      avatarInitials: this.myInitials,
      avatarColor: this.myAvatarColor,
      text: this.commentForm.value.text.trim(),
      postedAt: new Date()
    };

    this.comments = [...this.comments, newComment];
    this.commentForm.reset();
    this.cdr.markForCheck();
  }

  onEnterKey(event: Event): void {
  const keyboardEvent = event as KeyboardEvent;

  if (!keyboardEvent.shiftKey) {
    keyboardEvent.preventDefault();
    this.submitComment();
  }
}

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  timeAgo(date: Date): string {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }
}