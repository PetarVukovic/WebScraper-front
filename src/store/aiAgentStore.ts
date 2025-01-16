import { makeAutoObservable, runInAction } from "mobx";
import { upsertAiAgent, fetchPromptByProjectId } from "../api/ai_agent_api";
import { PromptInput } from "../types";

class AIAgentStore {
  promptInput: PromptInput = {
    email_prompt: "",
    qualification_prompt: "",
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
        return {
          email_prompt: "",
          qualification_prompt: "",
        };
      }
      return {
        ...response,
        email_prompt: response.prompt,
        qualification_prompt: response.prompt_qualification,
      };
    } catch (error) {
      console.error("Error fetching prompts:", error);
      runInAction(() => {
        this.error = "Failed to fetch prompts. Please try again later.";
      });
      return {
        email_prompt: "",
        qualification_prompt: "",
      };
    }
  }

  async makeNewPrompt(promptInput: PromptInput) {
    if (!promptInput.project_id) {
      this.error = "Project ID is required";
      return;
    }
    console.log("[makeNewPrompt] promptInput:", promptInput);

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
        this.error = "Failed to save prompts. Please try again later.";
        this.isGenerating = false;
      });
      throw error;
    }
  }
}

export default AIAgentStore;
