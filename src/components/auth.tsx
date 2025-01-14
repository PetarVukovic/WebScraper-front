import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { authStore } from "../store/authStore";
import ErrorAuthModal from "./modals/Errorauthmodal";

export const Auth = observer(() => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authStore.isAuthenticated) {
      navigate("/dashboard");
    }
  }, [authStore.isAuthenticated, navigate]);

  useEffect(() => {
    emailRef.current?.focus();
  }, [isLogin]);

  const allowedEmails = [
    "david.nordin@m-tab.se",
    "gustav.lysell@m-tab.se",
    "marcus.pettersson@m-tab.se",
    "petar.vukovic@formify.eu",
    "tommy.anzelius@m-tab.se",
    "david.nordin@formify.se",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    authStore.error = null;

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Email and password are required");
      return;
    }

    if (!allowedEmails.includes(email.trim())) {
      setErrorMessage("You are not in Formify space");
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        await authStore.login(email, password);
        navigate("/dashboard");
      } else {
        await authStore.register(email, password);
        setRegistrationSuccess(true);
        setIsLogin(true);
        setPassword("");
      }
    } catch (err) {
      setErrorMessage(authStore.error || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white shadow-lg rounded-lg p-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </h2>
        </div>

        {registrationSuccess && (
          <div className="bg-green-50 p-4 rounded-md">
            <div className="text-green-700 text-sm text-center">
              Registration successful! Please sign in with your new account.
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                ref={emailRef}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={
                  isLogin ? "Enter your password" : "Create a password"
                }
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : isLogin ? (
              "Sign in"
            ) : (
              "Register"
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setEmail("");
                setPassword("");
                setRegistrationSuccess(false);
                setErrorMessage(null);
              }}
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              disabled={isLoading}
            >
              {isLogin
                ? "Don't have an account? Register"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>

      <ErrorAuthModal
        isOpen={!!errorMessage}
        message={errorMessage || ""}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
});
