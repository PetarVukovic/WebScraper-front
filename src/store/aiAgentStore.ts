import { makeAutoObservable, runInAction } from "mobx";
import { upsertAiAgent, fetchPromptByProjectId } from "../api/ai_agent_api";
import { PromptInput } from "../types";

class AIAgentStore {
  promptInput: PromptInput = {
    email_prompt: "",
    qualification_prompt: "",
    project_id: 0,
    personalization_enabled: false,
  };

  isGenerating: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setPromptInput<K extends keyof PromptInput>(field: K, value: PromptInput[K]) {
    runInAction(() => {
      this.promptInput[field] = value;
    });
  }

  resetPromptInput() {
    runInAction(() => {
      this.promptInput = {
        email_prompt: "",
        qualification_prompt: "",
        project_id: 0,
        personalization_enabled: false,
      };
    });
  }

  async fetchPrompt(projectId: number) {
    try {
      const response = await fetchPromptByProjectId(projectId);
      runInAction(() => {
        if (response === null) {
          this.resetPromptInput();
          this.promptInput.project_id = projectId;
        } else {
          this.promptInput = {
            email_prompt: response.prompt,
            qualification_prompt: response.prompt_qualification,
            project_id: projectId,
            personalization_enabled: response.personalization_enabled,
          };
        }
      });
    } catch (error) {
      runInAction(() => {
        this.error = "Failed to fetch prompts. Please try again later.";
        this.resetPromptInput();
      });
    }
  }

  async savePrompt() {
    if (!this.promptInput.project_id) {
      this.error = "Project ID is required";
      return;
    }

    this.isGenerating = true;
    this.error = null;

    try {
      await upsertAiAgent(this.promptInput);
      runInAction(() => {
        this.isGenerating = false;
        this.error = null;
        this.successMessage = "Preferences saved successfully!";
      });
    } catch (error) {
      runInAction(() => {
        this.error = "Failed to save prompts. Please try again later.";
        this.isGenerating = false;
      });
    }
  }

  clearMessages() {
    runInAction(() => {
      this.error = null;
      this.successMessage = null;
    });
  }
}

export default AIAgentStore;
