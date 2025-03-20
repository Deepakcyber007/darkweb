export interface SearchResult {
  found: boolean;
  data?: {
    name: string;
    email: string;
    phone: string;
    breach_date: string;
    breach_source: string;
    compromised_data: string[];
    severity: 'high' | 'medium' | 'low';
    profile_picture?: string;
    breach_documents?: string[];
  };
}