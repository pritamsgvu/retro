import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '.././../../environments/environment';

@Component({
  selector: 'app-message',
  imports: [CommonModule, ReactiveFormsModule],

  templateUrl: './message.component.html'
})
export class MessageComponent implements OnInit {
  addMessageForm!: FormGroup;
  messages: any[] = [];
  loading = false;
  private apiUrl = environment.apiUrl+ '/message';
  isAdminOrManager: boolean = true; // Replace this with actual role check


  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.addMessageForm = this.fb.group({
      message: ['', Validators.required]
    });

    this.loadMessages();
    this.getUserRole();
  }

  getUserRole() {
    const session = JSON.parse(localStorage.getItem('user') || '');
    if (session && session?.role == 'employee') {
      this.isAdminOrManager = false;
    } else {
      this.isAdminOrManager = true;
    }
  }

  loadMessages(): void {
    this.loading = true;
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.messages = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading messages:', err);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.addMessageForm.invalid) return;

    const newMessage = this.addMessageForm.value;

    this.http.post(this.apiUrl+'/create', newMessage).subscribe({
      next: () => {
        this.addMessageForm.reset();
        this.loadMessages();
      },
      error: (err) => {
        console.error('Error adding message:', err);
      }
    });
  }

  deleteMessage(id: string): void {
    if (!confirm('Are you sure you want to delete this message?')) return;

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.loadMessages();
      },
      error: (err) => {
        console.error('Error deleting message:', err);
      }
    });
  }
}
