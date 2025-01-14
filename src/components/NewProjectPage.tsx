import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useRootStore } from "../store/RootStoreContext";

export const NewProjectPage = () => {
  const [newProject, setNewProject] = useState({
    project_name: "",
    description: "",
  });
  const navigate = useNavigate();
  const { projectStore } = useRootStore();

  const handleCreateProject = () => {
    if (newProject.project_name && newProject.description) {
      projectStore.createNewProject(newProject);
      setNewProject({ project_name: "", description: "" });
      navigate("/projects"); // Povratak na listu projekata
    } else {
      alert("Please fill all fields!");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
        <input
          type="text"
          placeholder="Project Name"
          value={newProject.project_name}
          onChange={(e) =>
            setNewProject({ ...newProject, project_name: e.target.value })
          }
          className="w-full mb-2 p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={newProject.description}
          onChange={(e) =>
            setNewProject({ ...newProject, description: e.target.value })
          }
          className="w-full mb-4 p-2 border rounded"
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => navigate("/projects")}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateProject}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};
