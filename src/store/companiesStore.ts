// CompaniesStore.ts
import { makeAutoObservable, runInAction } from "mobx";
import { CompaniesOutput, CompanyInputModel } from "../types";
import {
  fetchCompaniesBySearchHistory,
  sendCompaniesToN8N,
} from "../api/companies_api";

class CompaniesStore {
  companiesList: CompaniesOutput[] = [];
  selectedCompanies: Set<string> = new Set(); // Track selected companies by website
  totalCompanies = 0;
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;
  selectedCompany: CompaniesOutput | null = null;
  companiesLoading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  toggleSelection(website: string) {
    if (this.selectedCompanies.has(website)) {
      this.selectedCompanies.delete(website);
    } else {
      this.selectedCompanies.add(website);
    }
  }

  isSelected(website: string): boolean {
    return this.selectedCompanies.has(website);
  }

  clearSelection() {
    this.selectedCompanies.clear();
  }

  async sendSelectedCompanies(): Promise<void> {
    const selectedCompaniesData: CompanyInputModel[] = this.companiesList
      .filter((company) => this.selectedCompanies.has(company.website))
      .map((company) => ({
        website: company.website,
        context_data: company.context_data,
        is_qualified: company.is_qualified,
        search_history_id: company.search_history_id,
        generated_email: company.generated_email,
        email: company.email,
      }));

    try {
      await sendCompaniesToN8N(selectedCompaniesData);
      this.clearSelection(); // Clear selection after successful send
    } catch (error) {
      this.error = "Failed to send companies to n8n.";
      throw error;
    }
  }

  async fetchCompanies(
    searchHistoryId: string,
    page: number = 0,
    pageSize: number = 5
  ): Promise<void> {
    this.error = null;
    this.currentPage = page;

    try {
      this.companiesLoading = true;
      const response = await fetchCompaniesBySearchHistory(
        searchHistoryId,
        page,
        pageSize
      );
      runInAction(() => {
        if (response?.items) {
          this.companiesList = response.items;
          this.totalCompanies = response.total;
          this.currentPage = response.page;
          this.pageSize = response.page_size;
          this.totalPages = Math.ceil(response.total / response.page_size);
        }
      });
    } catch (error) {
      runInAction(() => {
        this.error = "Failed to fetch companies.";
        this.companiesList = [];
      });
    } finally {
      runInAction(() => {
        this.companiesLoading = false;
      });
    }
  }

  reset() {
    runInAction(() => {
      this.companiesList = [];
      this.totalCompanies = 0;
      this.currentPage = 0;
      this.error = null;
      this.companiesLoading = false;
      this.selectedCompanies.clear();
    });
  }
}

export default CompaniesStore;
