// AIAgentPage.tsx
import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../store/RootStoreContext";
import { Spinner } from "./Spinner";
import SuccessModal from "./modals/SuccessModal";
import ErrorModal from "./modals/ErrorModal";

const AIAgentPage: React.FC = observer(() => {
  const { aiAgentStore, projectStore } = useRootStore();

  useEffect(() => {
    if (projectStore.projects.length === 0) {
      projectStore.loadProjects();
    }
  }, [projectStore]);

  useEffect(() => {
    if (aiAgentStore.promptInput.project_id) {
      aiAgentStore.fetchPrompt(aiAgentStore.promptInput.project_id);
    }
  }, [aiAgentStore.promptInput.project_id]);

  const handleEmailPromptChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    aiAgentStore.setPromptInput("email_prompt", e.target.value);
  };

  const handleQualificationPromptChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    aiAgentStore.setPromptInput("qualification_prompt", e.target.value);
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    aiAgentStore.setPromptInput("project_id", Number(e.target.value));
  };

  const handlePersonalizedEmailsChange = () => {
    aiAgentStore.setPromptInput(
      "personalization_enabled",
      !aiAgentStore.promptInput.personalization_enabled
    );
  };

  return (
    <div className="relative min-h-screen bg-gray-50 ml-64">
      {(aiAgentStore.isGenerating || projectStore.loading) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Spinner />
        </div>
      )}

      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">
          AI Email Campaign Agent
        </h1>
        <p className="text-gray-600">
          Configure and test your email outreach assistant
        </p>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="col-span-10 bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Configure Email Prompts</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Project
              </label>
              <select
                value={aiAgentStore.promptInput.project_id || ""}
                onChange={handleProjectChange}
                className="w-full p-2 border rounded-lg bg-white"
                disabled={projectStore.loading}
              >
                <option value="">Select a project</option>
                {projectStore.projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.project_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Prompt
              </label>
              <textarea
                value={aiAgentStore.promptInput.email_prompt}
                onChange={handleEmailPromptChange}
                className="w-full h-32 p-4 border rounded-lg font-mono text-sm"
                placeholder="Your email prompt..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualification Prompt
              </label>
              <textarea
                value={aiAgentStore.promptInput.qualification_prompt}
                onChange={handleQualificationPromptChange}
                className="w-full h-32 p-4 border rounded-lg font-mono text-sm"
                placeholder="Your qualification prompt..."
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="block text-sm font-medium text-gray-700">
                Use Personalized Emails
              </label>
              <input
                type="checkbox"
                checked={aiAgentStore.promptInput.personalization_enabled}
                onChange={handlePersonalizedEmailsChange}
                className="h-5 w-5"
              />
            </div>

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={() => aiAgentStore.savePrompt()}
              disabled={
                aiAgentStore.isGenerating ||
                !aiAgentStore.promptInput.project_id
              }
            >
              Save Preferences
            </button>

            <ErrorModal
              error={aiAgentStore.error}
              onClose={() => aiAgentStore.clearMessages()}
            />
            <SuccessModal
              message={aiAgentStore.successMessage}
              onClose={() => aiAgentStore.clearMessages()}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default AIAgentPage;
