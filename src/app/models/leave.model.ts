export interface Leave {
    _id?: string;
    userId: string;
    fromDate: string; // ISO date string
    toDate: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected'; // match backend enum
  }
  