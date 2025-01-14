import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Spinner } from "./Spinner";
import { Link, useNavigate } from "react-router-dom";
import { useRootStore } from "../store/RootStoreContext";
import { Project } from "../types";

// Reusable ProjectList Component
const ProjectList: React.FC<{ projects: Project[] }> = observer(
  ({ projects }) => {
    const { projectStore } = useRootStore();
    const navigate = useNavigate();

    const handleClickProject = (project: Project) => {
      localStorage.setItem("selectedProject", JSON.stringify(project));
      projectStore.selectProject(project);
      navigate("/projects");
    };

    if (!Array.isArray(projects)) {
      return <p>No projects available.</p>;
    }

    return (
      <ul className="space-y-4">
        {projects.map((project) => (
          <li
            key={project.id}
            className="p-4 border rounded shadow hover:shadow-md"
          >
            <button
              onClick={() => handleClickProject(project)}
              className="w-full flex flex-col rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            >
              <h2 className="text-lg font-semibold">{project.project_name}</h2>
              <p className="text-gray-700">{project.description}</p>
            </button>
          </li>
        ))}
      </ul>
    );
  }
);

export const Dashboard: React.FC = observer(() => {
  const { projectStore } = useRootStore();
  const { loading, error, loadProjects, projects } = projectStore;

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <div className="ml-64 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <h2 className="text-2xl font-bold mb-4">
          Welcome to Web Scraper App 🚀
        </h2>
        <p className="text-gray-600 mb-6">
          Manage your scraping projects efficiently and effortlessly. Start
          creating your first project or explore existing ones! 🛠️
        </p>

        <div className="mb-8 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">📘 How to Use the App</h3>
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>
              <strong>Create a New Project:</strong> Add a description for your
              project, e.g., scraping a city or country. 🌍
            </li>
            <li>
              <strong>Set Up Your AI Agent:</strong> Use the sidebar to
              configure an email template prompt for generating personalized
              emails. 📧
            </li>
            <li>
              <strong>Add a Row for Scraping:</strong> Choose between scraping
              an entire country (time-consuming, less accurate) or a city within
              a country. Currently, only European countries are supported. 🇪🇺
            </li>
            <li>
              <strong>Start Scraping:</strong> Click on the row in the project
              and initiate scraping. This process takes 5–15 minutes depending
              on the parameters. ⏳
            </li>
            <li>
              <strong>View Results:</strong> Once scraping is complete, you'll
              see a "Scraping Finished" message. Click "Show Companies" to view
              the scraped companies. 🏢
            </li>
            <li>
              <strong>Automated Workflow:</strong> The n8n workflow processes
              scraped data and sends personalized emails automatically. 🔄
            </li>
          </ol>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-600">
              Failed to load projects. Please try again later.
            </p>
          </div>
        ) : Array.isArray(projects) && projects.length > 0 ? (
          <ProjectList projects={projects} />
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-4">No projects available yet.</p>
            <Link
              to="/new-project"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
            >
              Create a New Project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
});
