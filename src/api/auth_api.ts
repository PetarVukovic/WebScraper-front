import axios from "axios";

const baseURL = "http://127.0.0.1:8000";

const apiClient = axios.create({
  baseURL,
  withCredentials: true, // ✅ Omogućava slanje HttpOnly cookies
});

// ✅ Interceptors za automatsko rukovanje `401 Unauthorized` (korisnik nije prijavljen)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized request - user is not authenticated.");
    }
    return Promise.reject(error);
  }
);

export const login = async (user: { email: string; password: string }) => {
  const response = await apiClient.post("/auth/login", user);
  return response.data;
};

export const register = async (user: { email: string; password: string }) => {
  const response = await apiClient.post("/auth/register", user);
  return response.data;
};

export const logout = async () => {
  await apiClient.post("/auth/logout"); // ✅ Briše HttpOnly kolačić
};

export const getUserProfile = async () => {
  const response = await apiClient.get("/auth/profile");
  return response.data;
};

export default apiClient;
