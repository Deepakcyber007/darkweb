export interface DataEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
  breach_date: string;
  breach_source: string;
  compromised_data: string[];
  severity: 'high' | 'medium' | 'low';
  removal_requested: boolean;
  request_date?: string;
  status: 'pending' | 'approved' | 'rejected';
  profile_picture?: string;
  breach_documents?: string[];
}

export interface NewEntryForm {
  name: string;
  email: string;
  phone: string;
  breach_date: string;
  breach_source: string;
  compromised_data: string;
  severity: 'high' | 'medium' | 'low';
  profile_picture?: File;
  breach_documents?: File[];
}