import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../store/RootStoreContext";
import { Settings2, MessageSquare, Mail, RefreshCw } from "lucide-react";
import { PromptInput } from "../store/aiAgentStore";
import { Spinner } from "./Spinner";
import SuccessModal from "./modals/SuccessModal";
import ErrorModal from "./modals/ErrorModal";

const AIAgentPage: React.FC = observer(() => {
  const { aiAgentStore, projectStore } = useRootStore();
  const [activeTab, setActiveTab] = useState<"configure" | "test" | "generate">(
    "configure"
  );
  const [promptInput, setPromptInput] = useState<PromptInput>({
    prompt: "",
    project_id: 0,
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load projects when component mounts
  useEffect(() => {
    if (projectStore.projects.length === 0) {
      projectStore.loadProjects();
    }
  }, [projectStore]);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptInput((prev) => ({
      ...prev,
      prompt: e.target.value,
    }));
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPromptInput((prev) => ({
      ...prev,
      project_id: Number(e.target.value),
    }));
  };

  const handleSubmit = async () => {
    if (!promptInput.project_id) {
      aiAgentStore.error = "Please select a project first";
      return;
    }

    try {
      await aiAgentStore.makeNewPrompt(promptInput);
      setSuccessMessage("Prompt saved successfully");
    } catch (error) {
      console.error("Failed to save prompt:", error);
    }
  };

  const handleErrorClose = () => {
    aiAgentStore.error = null;
  };

  const handleSuccessClose = () => {
    setSuccessMessage(null);
  };

  useEffect(() => {
    const loadPrompt = async () => {
      if (promptInput.project_id) {
        const promptData = await aiAgentStore.fetchPrompt(
          promptInput.project_id
        );
        if (promptData) {
          setPromptInput((prev) => ({
            ...prev,
            prompt: promptData,
          }));
        } else {
          setPromptInput((prev) => ({
            ...prev,
            prompt: "",
          }));
        }
      }
    };
    loadPrompt();
  }, [promptInput.project_id]);

  return (
    <div className="relative min-h-screen bg-gray-50 ml-64">
      {/* Spinner Overlay */}
      {(aiAgentStore.isGenerating || projectStore.loading) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Spinner />
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">
          AI Email Campaign Agent
        </h1>
        <p className="text-gray-600">
          Configure and test your email outreach assistant
        </p>
      </div>

      {/* Main Content */}
      <div
        className={`container mx-auto px-4 py-6 ${
          aiAgentStore.isGenerating || projectStore.loading ? "blur-sm" : ""
        }`}
      >
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Navigation */}
          <div className="col-span-2">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("configure")}
                className={`w-full px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  activeTab === "configure"
                    ? "bg-blue-500 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <Settings2 className="w-5 h-5" />
                <span>Configure</span>
              </button>
              <button
                onClick={() => setActiveTab("test")}
                className={`w-full px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  activeTab === "test"
                    ? "bg-blue-500 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span>Test</span>
              </button>
              <button
                onClick={() => setActiveTab("generate")}
                className={`w-full px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  activeTab === "generate"
                    ? "bg-blue-500 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <Mail className="w-5 h-5" />
                <span>Generate</span>
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="col-span-10">
            {activeTab === "configure" && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">
                  Configure Email Template
                </h2>
                <div className="space-y-4">
                  {/* Project Selection Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Project
                    </label>
                    <select
                      value={promptInput.project_id || ""}
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
                    {projectStore.loading && (
                      <div className="mt-2 text-sm text-gray-500 flex items-center">
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                        Loading projects...
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prompt Configuration
                    </label>
                    <textarea
                      value={promptInput.prompt}
                      onChange={handlePromptChange}
                      className="w-full h-96 p-4 border rounded-lg font-mono text-sm"
                      placeholder="Configure your AI prompt here..."
                    />
                  </div>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                    onClick={handleSubmit}
                    disabled={
                      aiAgentStore.isGenerating || !promptInput.project_id
                    }
                  >
                    {aiAgentStore.isGenerating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Save Template</span>
                    )}
                  </button>
                  {aiAgentStore.error && (
                    <p className="text-red-500 mt-2">{aiAgentStore.error}</p>
                  )}{" "}
                  <ErrorModal
                    error={aiAgentStore.error}
                    onClose={handleErrorClose}
                  />
                  <SuccessModal
                    message={successMessage}
                    onClose={handleSuccessClose}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default AIAgentPage;
