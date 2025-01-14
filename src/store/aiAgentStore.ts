// types/index.ts
export interface PromptInput {
  prompt: string;
  project_id: number;
}

export interface PromptOutput extends PromptInput {
  id: number;
  created_at: Date;
}

// store/aiAgentStore.ts
import { makeAutoObservable, runInAction } from "mobx";
import { upsertAiAgent, fetchPromptByProjectId } from "../api/ai_agent_api";

class AIAgentStore {
  promptInput: PromptInput = {
    prompt: "",
    project_id: 0,
  };
  isGenerating: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }
  async fetchPrompt(projectId: number) {
    try {
      const response = await fetchPromptByProjectId(projectId);
      if (response === null) {
        // No prompt exists yet
        return "";
      }
      return response;
    } catch (error) {
      console.error("Error fetching prompt:", error);
      runInAction(() => {
        this.error = "Failed to fetch prompt. Please try again later.";
      });
      return ""; // Return empty string on error
    }
  }

  async makeNewPrompt(promptInput: PromptInput) {
    if (!promptInput.project_id) {
      this.error = "Project ID is required";
      return;
    }

    this.isGenerating = true;
    this.error = null;

    try {
      const response = await upsertAiAgent(promptInput);
      runInAction(() => {
        this.isGenerating = false;
        this.error = null;
      });
      return response;
    } catch (error) {
      runInAction(() => {
        this.error = "Failed to save prompt. Please try again later.";
        this.isGenerating = false;
      });
      throw error;
    }
  }
}

export default AIAgentStore;
