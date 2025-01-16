import { makeAutoObservable, runInAction } from "mobx";
import type { Project, CompaniesOutput } from "../types";

import { fetchProjects, createProject } from "../api/auth_api";
import { deleteProject } from "../api/project_api";

class ProjectStore {
  projects: Project[] = [];
  selectedProject: Project | null = null;
  loading = false;
  deleteLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadFromLocalStorage(); // Učitavanje podataka iz localStorage pri pokretanju
  }
  loadFromLocalStorage() {
    const storedProjects = localStorage.getItem("projects");
    const storedSelectedProject = localStorage.getItem("selectedProject");

    if (storedProjects) {
      this.projects = JSON.parse(storedProjects);
    }

    if (storedSelectedProject) {
      this.selectedProject = JSON.parse(storedSelectedProject);
    }
  }
  loadProjects = async () => {
    this.loading = true;
    this.error = null;
    console.log("[loadProjects] Fetching projects...");
    try {
      const data = await fetchProjects();
      runInAction(() => {
        this.projects = data;
        // Ako nema selektiran projekt, uzmi zadnji
        if (!this.selectedProject && this.projects.length > 0) {
          this.selectedProject = this.projects[this.projects.length - 1];
        }
      });
    } catch (err) {
      runInAction(() => {
        this.error = "Failed to load projects.";
      });
      console.error("[loadProjects] Error:", err);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  /**
   * Odabir projekta
   */
  selectProject(project: Project | null) {
    console.log("[selectProject] Selected project:", project);
    this.selectedProject = project;
  }
  async createNewProject(project: {
    project_name: string;
    description: string;
  }) {
    console.log("[createNewProject] Creating project with data:", project);
    try {
      const newProject = await createProject(project);
      console.log("[createNewProject] Response from API:", newProject);
      runInAction(() => {
        this.projects.push(newProject);
        this.selectedProject = newProject;
      });
    } catch (err) {
      runInAction(() => {
        this.error = "Failed to create project.";
      });
      console.error("[createNewProject] Error:", err);
    }
  }

  deleteProject = async (projectId: number) => {
    this.deleteLoading = true;
    this.error = null;
    console.log("[deleteProject] Deleting projectId:", projectId);
    try {
      await deleteProject(projectId.toString());
      console.log("[deleteProject] Successfully deleted project:", projectId);
      runInAction(() => {
        this.projects = this.projects.filter((proj) => proj.id !== projectId);
        console.log(this.projects);
        if (this.selectedProject?.id === projectId) {
          this.selectedProject =
            this.projects.length > 0
              ? this.projects[this.projects.length - 1]
              : null;
        }
      });
    } catch (err) {
      runInAction(() => {
        this.error = "Failed to delete project.";
      });
      console.error("[deleteProject] Error:", err);
    } finally {
      runInAction(() => {
        this.deleteLoading = false;
      });
    }
  };

  removeProject(projectId: number) {
    console.log("[removeProject] Removing projectId:", projectId);
    this.projects = this.projects.filter((proj) => proj.id !== projectId);
    if (this.selectedProject?.id === projectId) {
      this.selectedProject = this.projects.length > 0 ? this.projects[0] : null;
    }
  }
}

export default ProjectStore;
