export interface User {
    _id?: string;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'user' | 'Employee';  // Adjust roles accordingly
    password?: string;
  }
  