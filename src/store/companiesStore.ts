// CompaniesStore.ts
import { makeAutoObservable, runInAction } from "mobx";
import { CompaniesOutput } from "../types";
import { fetchCompaniesBySearchHistory } from "../api/companies_api";

class CompaniesStore {
  companiesList: CompaniesOutput[] = [];
  totalCompanies = 0;
  currentPage = 0;
  pageSize = 5; // Changed to 5 items per page
  totalPages = 0;
  selectedCompany: CompaniesOutput | null = null;
  companiesLoading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
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
      this.companiesLoading = false;
      if (response?.items) {
        this.companiesList = response.items;
        this.totalCompanies = response.total;
        this.currentPage = response.page;
        this.pageSize = response.page_size;
        this.totalPages = Math.ceil(response.total / response.page_size);
      }
    } catch (error) {
      this.error = "Failed to fetch companies.";
      this.companiesLoading = false;
      this.companiesList = [];
    } finally {
      this.companiesLoading = false;
    }
  }

  reset() {
    runInAction(() => {
      this.companiesList = [];
      this.totalCompanies = 0;
      this.currentPage = 0;
      this.error = null;
      this.companiesLoading = false; // Dodano resetiranje loading stanja
    });
  }
}

export default CompaniesStore;
