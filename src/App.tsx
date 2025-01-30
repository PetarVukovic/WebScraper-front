import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { Sidebar } from "./components/Sidebar";
import { observer } from "mobx-react-lite";
import { authStore } from "./store/authStore";
import { Auth } from "./components/auth";
import { ProjectsPage } from "./components/projects/ProjectsPage";
import { NewProjectPage } from "./components/NewProjectPage";
import AIAgentPage from "./components/AIAgentPage";
import { useNavigate } from "react-router-dom";

const PrivateRoute = observer(({ children }: { children: React.ReactNode }) => {
  return authStore.isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
});

const App = observer(() => {
  const navigate = useNavigate(); // ✅ Definišemo `navigate`

  useEffect(() => {
    authStore.checkAuthStatus(); // ✅ Proveri status pri učitavanju

    if (!authStore.isAuthenticated) {
      navigate("/login"); // ✅ Ako nije prijavljen, ide na /login
    }
  }, [authStore.isAuthenticated, navigate]);
  return (
    <div className="flex h-screen">
      {authStore.isAuthenticated && <Sidebar />}
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <PrivateRoute>
                <ProjectsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/new-project"
            element={
              <PrivateRoute>
                <NewProjectPage />
              </PrivateRoute>
            }
          />{" "}
          <Route
            path="/ai-agent"
            element={
              <PrivateRoute>
                <AIAgentPage />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
});

export default App;
