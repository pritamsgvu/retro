import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '.././../../environments/environment';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  mobile: string;
  aadhar: string;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  addUserForm: FormGroup;
  roles: string[] = ['admin', 'manager', 'employee'];
  editMode: boolean = false;
  editingUserId: string | null = null;
  loading: boolean = true;
  private apiUrl = environment.apiUrl+ '/users';

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.addUserForm = this.fb.group({
      name: ['', Validators.required],
      mobile: ['', Validators.required],
      aadhar: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', []],
      role: ['employee', Validators.required]
    });
  }

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.http.get<User[]>(this.apiUrl)
      .subscribe({
        next: (data) => {
          this.users = data;
          this.loading = false;

        },
        error: (err) => {
          this.loading = false;

        }
      });
  }

  onSubmit() {
    if (this.addUserForm.invalid) {
      alert('Please fill all required fields correctly!');
      return;
    }

    if (!this.editMode && !this.addUserForm.value.password) {
      alert('Password is required for new user!');
      return;
    }

    if (this.editMode && this.editingUserId) {
      // Remove password from data if empty
      const updatedData = { ...this.addUserForm.value };
      if (!updatedData.password) {
        delete updatedData.password;
      }

      this.updateUser(this.editingUserId, updatedData);
    } else {
      this.http.post<User>(this.apiUrl+'/create', this.addUserForm.value)
        .subscribe({
          next: (newUser) => {
            alert('User added successfully!');
            this.users.push(newUser);
            this.addUserForm.reset();
          },
          error: (err) => {
            alert('Failed to add user.');
          }
        });
    }
  }


  editUser(user: User) {
    this.editMode = true;
    this.editingUserId = user._id;
    this.addUserForm.patchValue({
      name: user.name,
      mobile: user.mobile,
      aadhar: user.aadhar,
      email: user.email,
      role: user.role,
      password: '' // Don't prefill password
    });
  }

  updateUser(id: string, userData: any) {
    this.http.put<User>(`${this.apiUrl}/${id}`, userData)
      .subscribe({
        next: (updatedUser) => {
          alert('User updated successfully!');
          const index = this.users.findIndex(u => u._id === id);
          if (index !== -1) this.users[index] = updatedUser;
          this.addUserForm.reset();
          this.editMode = false;
          this.editingUserId = null;
        },
        error: (err) => {
          alert('Failed to update user.');
        }
      });
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`${this.apiUrl}/${id}`)
        .subscribe({
          next: () => {
            alert('User deleted successfully!');
            this.users = this.users.filter(u => u._id !== id);
          },
          error: (err) => {
            alert('Failed to delete user.');
          }
        });
    }
  }
}
