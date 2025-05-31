import { Component, OnInit } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators , ReactiveFormsModule, FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '.././../../environments/environment';



@Component({
  selector: 'app-leave',
  templateUrl: './leaves.component.html',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  styleUrls: ['./leaves.component.css'],
})
export class LeaveComponent implements OnInit {
  leaveForm: FormGroup;
  leaves: any[] = [];
  filteredLeaves: any[] = [];
  users: any[] = []; // For employee filter dropdown

  filterEmployee: string = '';
  filterFromDate: string = '';
  filterToDate: string = '';

  isAdminOrManager: boolean = true; // Replace this with actual role check
  loading: boolean = true;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.leaveForm = this.fb.group({
      reason: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getLeaves();
    this.getUsers();
  }

  applyLeave() {
    if (this.leaveForm.invalid) return alert('Fill all fields');
    this.http.post(`${this.apiUrl}'/leaves/apply'`, this.leaveForm.value).subscribe({
      next: (res) => {
        alert('Leave Applied!');
        this.getLeaves();
        this.leaveForm.reset();
      },
      error: (err) => alert('Error applying leave')
    });
  }

  getLeaves() {
    this.http.get<any[]>(`${this.apiUrl}/leaves`).subscribe({
      next: (data) => {
        this.leaves = data;
        this.filteredLeaves = data;
        this.loading = false;
      },
      error: (err) => console.error(err)
    });
  }

  getUsers() {
    this.http.get<any[]>(`${this.apiUrl}/users`).subscribe({
      next: (data) => (this.users = data),
      error: (err) => console.error(err),
    });
  }

  applyFilters() {
    this.filteredLeaves = this.leaves.filter((leave) => {
      // const matchEmployee = this.filterEmployee ? leave.employee?._id === this.filterEmployee : true;
      const matchFrom = this.filterFromDate ? new Date(leave.fromDate) >= new Date(this.filterFromDate) : true;
      const matchTo = this.filterToDate ? new Date(leave.toDate) <= new Date(this.filterToDate) : true;
      return matchFrom && matchTo;
    });
  }

  resetFilters() {
    this.filterEmployee = '';
    this.filterFromDate = '';
    this.filterToDate = '';
    this.filteredLeaves = this.leaves;
  }

  updateLeaveStatus(leaveId: string, status: string) {
    this.http.put(`${this.apiUrl}/leaves/${leaveId}`, { status }).subscribe({
      next: (res) => {
        alert(`Leave ${status}`);
        this.getLeaves();
      },
      error: (err) => alert('Error updating status'),
    });
  }
}
