import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Folder,
  ChevronDown,
  ChevronUp,
  LogOut,
  Plus,
  Bot,
  Search,
  FileText,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import { authStore } from "../store/authStore";
import { useRootStore } from "../store/RootStoreContext";
import { Spinner } from "./Spinner";

export const Sidebar = observer(() => {
  const { projectStore } = useRootStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleProjectSelect = (project: any) => {
    projectStore.selectProject(project);
    localStorage.setItem("selectedProject", JSON.stringify(project));
    navigate("/projects");
  };

  useEffect(() => {
    const storedSelectedProject = localStorage.getItem("selectedProject");
    if (storedSelectedProject) {
      const selectedProject = JSON.parse(storedSelectedProject);
      projectStore.selectProject(selectedProject);
    }
    projectStore.loadProjects();
  }, [projectStore]);

  const handleLogout = () => {
    authStore.logout();
  };

  if (!projectStore.projects || !Array.isArray(projectStore.projects)) {
    return <div>Loading</div>;
  }

  const filteredProjects = projectStore.projects.filter((project) =>
    project.project_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get last 4 projects when no search term
  const displayedProjects = searchTerm
    ? filteredProjects
    : projectStore.projects.slice(-4);

  return (
    <div className="w-64 bg-gray-100 h-screen fixed top-0 left-0 shadow-md flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <h1 className="text-xl font-bold text-center text-gray-800">
          Web Scraper
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
        <Link
          to="/dashboard"
          className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
            location.pathname === "/dashboard"
              ? "bg-blue-500 text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          <FileText className="w-5 h-5 mr-3" />
          Dashboard
        </Link>

        {/* Projects Section */}
        <div className="space-y-3">
          <button
            onClick={() => setIsProjectsOpen(!isProjectsOpen)}
            className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors duration-200"
          >
            <Folder className="w-5 h-5 mr-3" />
            Projects
            {isProjectsOpen ? (
              <ChevronUp className="ml-auto w-5 h-5" />
            ) : (
              <ChevronDown className="ml-auto w-5 h-5" />
            )}
          </button>

          {isProjectsOpen && (
            <div className="space-y-3">
              {/* Search Input */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Projects List */}
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {displayedProjects.map((project) => (
                  <li key={project.id}>
                    <button
                      onClick={() => handleProjectSelect(project)}
                      className="w-full flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                    >
                      <FileText className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="truncate">{project.project_name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => navigate("/new-project")}
            className="w-full flex items-center p-3 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            <Plus className="w-5 h-5 mr-3" />
            New Project
          </button>

          <button
            onClick={() => navigate("/ai-agent")}
            className="w-full flex items-center p-3 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            <Bot className="w-5 h-5 mr-3" />
            AI Agent
          </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t bg-white">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
});
