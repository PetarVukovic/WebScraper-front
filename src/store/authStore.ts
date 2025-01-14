import { makeAutoObservable } from "mobx";
import { login as apiLogin, register as apiRegister } from "../api/auth_api";

class AuthStore {
  isAuthenticated = false;
  token: string | null = null;
  user: string | null = null;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadToken(); // Učitaj token prilikom inicijalizacije
  }

  // Učitavanje tokena iz localStorage
  loadToken() {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      this.token = savedToken;
      this.isAuthenticated = true;
    }
  }

  // Spremanje tokena u localStorage
  saveToken(token: string) {
    this.token = token;
    localStorage.setItem("authToken", token);
    this.isAuthenticated = true;
  }

  // Uklanjanje tokena iz localStorage
  clearToken() {
    this.token = null;
    localStorage.removeItem("authToken");
    this.isAuthenticated = false;
  }

  async login(email: string, password: string) {
    try {
      const response = await apiLogin({ email, password });
      this.saveToken(response.access_token); // Spremi token
      this.user = response.user;
      this.error = null;
    } catch (err: any) {
      this.error = err.message || "Login failed";
      this.isAuthenticated = false;
      throw err;
    }
  }

  async register(email: string, password: string) {
    try {
      const response = await apiRegister({ email, password });
      this.user = response.user;
      this.error = null;
    } catch (err: any) {
      this.error = err.message || "Registration failed";
      throw err;
    }
  }

  logout() {
    this.clearToken(); // Ukloni token
    this.user = null;
    this.error = null;
  }
}

export const authStore = new AuthStore();
