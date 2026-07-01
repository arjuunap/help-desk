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
import { CommentServices } from '../../../core/services/comment/comment-services';
import { environment } from '../../../environment/environment';

export interface Comment {
  id: number;
  author: string;
  avatarInitials: string;
  avatarColor: string;
  text: string;
  postedAt: Date;
  attachments?: any[];
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
  currentTicketId = 0;
  selectedFiles: any[] = [];
  cd: any;
  filePath = environment.filePath;


  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketServices,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private commentService: CommentServices
  ) { }

  ngOnInit(): void {
    this.commentForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(2)]]
    });

    this.currentTicketId = Number(
      this.route.snapshot.paramMap.get('ticketId')
    );

    if (this.currentTicketId) {
      this.fetchTicket(this.currentTicketId);
      this.fetchComments(this.currentTicketId);
    }
  }
  fetchComments(ticketId: number): void {
    this.commentService.getCommentsByTicketId(ticketId).subscribe({
      next: (data) => {
        console.log("comment data", data);
        this.comments = data.map((item: any) => ({
          id: item.commentId,
          author: item.author?.fullName || 'User',
          avatarInitials: (item.author?.fullName || 'U')
            .split(' ')
            .map((x: string) => x[0])
            .join('')
            .substring(0, 2)
            .toUpperCase(),
          avatarColor: '#2563eb',
          text: item.body,
          postedAt: new Date(),
          attachments: item.attachments || []
        }));

        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Failed to load comments.';
        this.cdr.markForCheck();
      }
    });
  }

  onFileSelected(event: Event): void {

  const input = event.target as HTMLInputElement;

  if (!input.files) {
    return;
  }

  this.selectedFiles = Array.from(input.files).map(file => ({
    file,
    preview: URL.createObjectURL(file),
    isImage: file.type.startsWith('image/'),
    isVideo: file.type.startsWith('video/')
  }));

  this.cdr.markForCheck();
}

  fetchTicket(id: number): void {
    this.loading = true;
    this.error = '';
    this.ticketService.getTicketById(id).subscribe({
      next: (data) => {
        this.ticket = data;
        this.loading = false;
        this.cdr.markForCheck();
        console.log("Ticket", data)
      },
      error: (err) => {
        this.error = 'Failed to load ticket. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  submitComment(): void {
    if (this.commentForm.invalid) {
      return;
    }

    const formData = new FormData();

    const data = {
      ticketId: this.currentTicketId,
      body: this.commentForm.value.text.trim(),
      internal: true
    };

    formData.append('data',
      new Blob([JSON.stringify(data)],
        { type: 'application/json' })
    )

    console.log("formm", JSON.stringify(data))



    this.selectedFiles.forEach(item => {
  formData.append('files', item.file);
});

    this.commentService
      .addComment(this.currentTicketId, formData)
      .subscribe({
        next: () => {

          this.commentForm.reset();
          this.selectedFiles = [];
          this.fetchComments(this.currentTicketId);
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Comment add failed', err);
        }
      });
  }

  deleteComment(commentId: number): void {

    

    this.commentService.deleteComment(commentId).subscribe({
      next: () => {

        this.comments = this.comments.filter(
          c => c.id !== commentId
        );

        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Delete comment failed', err);
      }
    });
  }

  deleteAttachment(commentId: number, attachment: any): void {

    const attachmentId =
      attachment.attachmentId ||
      attachment.id ||
      attachment.fileId;

    

    if (!attachmentId) {
      console.error('Attachment id not found', attachment);
      return;
    }

    if (!confirm('Delete this attachment?')) {
      return;
    }

    this.commentService.deleteAttachment(attachmentId).subscribe({
      next: () => {

        const comment = this.comments.find(
          c => c.id === commentId
        );

        if (comment) {
          comment.attachments =
            comment.attachments?.filter(a => a !== attachment);
        }

        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Delete attachment failed', err);
        
      }
    });
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

  removeFile(index: number): void {
  this.selectedFiles.splice(index, 1);
  this.cdr.markForCheck();
}



}