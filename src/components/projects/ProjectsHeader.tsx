import { observer } from "mobx-react-lite";
import { useRootStore } from "../../store/RootStoreContext";

const ProjectsHeader = observer(() => {
  const { projectStore } = useRootStore();
  const { selectedProject, deleteProject, deleteLoading } = projectStore;
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Projects</h1>

      {selectedProject ? (
        <div className="p-6 bg-white border rounded shadow flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedProject.project_name}
            </h2>
            <p className="text-gray-600 mt-2">{selectedProject.description}</p>
          </div>
          <button
            onClick={() => deleteProject(selectedProject.id)}
            disabled={deleteLoading}
            className={`flex items-center gap-2 px-4 py-2 ${
              deleteLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            } text-white font-semibold rounded`}
          >
            {deleteLoading ? "Deleting..." : "Delete Project"}
          </button>
        </div>
      ) : (
        <p>No project selected.</p>
      )}
    </>
  );
});

export default ProjectsHeader;
