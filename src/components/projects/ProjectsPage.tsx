import { observer } from "mobx-react-lite";
import { ScrapingForm } from "../ScrapingForm";
import ProjectsHeader from "./ProjectsHeader";

export const ProjectsPage = observer(() => {
  return (
    <div className="ml-64 p-6 bg-gray-50 min-h-screen">
      <ProjectsHeader />
      <ScrapingForm />
    </div>
  );
});
