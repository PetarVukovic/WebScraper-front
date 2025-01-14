import ProjectStore from "./projectStore";
import SearchHistoryStore from "./searchHistoryStore";
import UiStore from "./uiStore";
import CompaniesStore from "./companiesStore";
import GoogleMapsStore from "./googleMapsStore";
import AIAgentStore from "./aiAgentStore";

class RootStore {
  projectStore: ProjectStore;
  googleMapsStore: GoogleMapsStore;
  searchHistoryStore: SearchHistoryStore;
  uiStore: UiStore;
  companiesStore: CompaniesStore;
  aiAgentStore: AIAgentStore;

  constructor() {
    this.projectStore = new ProjectStore();
    this.googleMapsStore = new GoogleMapsStore();
    this.searchHistoryStore = new SearchHistoryStore();
    this.uiStore = new UiStore();
    this.companiesStore = new CompaniesStore();
    this.aiAgentStore = new AIAgentStore();
  }
}

export const rootStore = new RootStore();
