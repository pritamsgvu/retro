import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '.././../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  private apiUrl = environment.apiUrl+ '/auth/login';


  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/leaves']);
    } else {
      localStorage.setItem('token', '');
    }
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.errorMessage = '';
    const loginData = this.loginForm.value;

    this.http.post<{ token: string; user: any }>(this.apiUrl, loginData)
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.router.navigate(['/leaves']);
        },
        error: (err) => {
          this.errorMessage = err.error?.error || 'Login failed';
        }
      });
  }
}
