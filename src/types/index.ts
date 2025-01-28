// Dodaj ili prilagodi tipove prema backendu
export interface Keyword {
  id: string;
  text: string;
}

export interface User {
  email: string;
  password: string;
}

export interface Project {
  id: number;
  project_name: string;
  description: string;
}

export interface ScrapeResult {
  category: string | null;
  website: string | null;
  phone: string | null;
  keywords?: string[];
}

export interface SearchHistoryCreate {
  maxCrawledPlacesPerSearch: number; // Adjusted naming for camelCase
  projectId: number; // Adjusted naming for camelCase
  city?: string; // Optional
  countryCode?: string; // Optional
  searchStringsArray?: string[]; // Optional
  locationQuery?: string; // Marked as optional
}

export interface SearchHistoryUpdate extends SearchHistoryCreate {
  id: string; // UUID equivalent as string
}

export interface SearchHistoryResponse extends SearchHistoryUpdate {
  createdAt: Date; // Changed to Date for consistency with datetime
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
export interface CompanyInputModel {
  website: string;
  context_data?: string;
  is_qualified: boolean;
  search_history_id: string;
  generated_email?: string;
  email?: string[] | string;
}

export interface CompaniesOutput {
  id?: string;
  website: string;
  keywords_found: string[];
  context_data: string;
  is_qualified: boolean;
  search_history_id: string;
  generated_email: string;
  email: string[];
}
export interface PromptInput {
  email_prompt: string;
  qualification_prompt: string;
  project_id: number;
}

export interface PromptOutput extends PromptInput {
  id: number;
  created_at: Date;
}
