import { makeAutoObservable, runInAction } from "mobx";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getUserProfile,
} from "../api/auth_api";

class AuthStore {
  isAuthenticated = false;
  user: string | null = null;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async checkAuthStatus() {
    try {
      const response = await getUserProfile();
      runInAction(() => {
        this.user = response.email;
        this.isAuthenticated = true;
      });
    } catch (err: any) {
      runInAction(() => {
        this.isAuthenticated = false;
        this.user = null;
      });

      if (err.response?.status === 401) {
        console.warn("Session expired. Logging out...");
      }
    }
  }

  async login(email: string, password: string) {
    try {
      await apiLogin({ email, password });
      await this.checkAuthStatus(); // ✅ Proveravamo status pre nego što nastavimo
      runInAction(() => {
        this.error = null;
      });
    } catch (err: any) {
      runInAction(() => {
        if (Array.isArray(err.response?.data?.detail)) {
          // ✅ Ako dobijemo niz grešaka, izvući ćemo samo poruke (`msg`)
          this.error = err.response.data.detail
            .map((e: any) => e.msg)
            .join(", ");
        } else {
          this.error = err.response?.data?.detail || "Login failed";
        }
      });
      throw err;
    }
  }

  async register(email: string, password: string) {
    try {
      await apiRegister({ email, password });
      await this.checkAuthStatus();
      runInAction(() => {
        this.error = null;
      });
    } catch (err: any) {
      runInAction(() => {
        if (Array.isArray(err.response?.data?.detail)) {
          // ✅ Ako dobijemo niz grešaka, izvući ćemo samo poruke (`msg`)
          this.error = err.response.data.detail
            .map((e: any) => e.msg)
            .join(", ");
        } else {
          this.error = err.response?.data?.detail || "Registration failed";
        }
      });
      throw err;
    }
  }

  async logout() {
    try {
      await apiLogout();
      await this.checkAuthStatus(); // ✅ Osiguravamo da je token obrisan

      runInAction(() => {
        this.isAuthenticated = false;
        this.user = null;
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }
}

export const authStore = new AuthStore();
