import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, register } from "../services/api";

// Définition du type User selon la structure attendue
interface User {
  _id: string;
  email: string;
  // Ajoute d'autres champs si besoin
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Vérifie si un token existe au chargement
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const userData = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError("");
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      router.push("/products"); // Redirige vers la liste des produits
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "response" in err) {
        setError((err as any).response?.data?.message || "Erreur lors de la connexion");
      } else {
        setError("Erreur lors de la connexion");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string) => {
    setLoading(true);
    setError("");
    try {
      const data = await register(email, password);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      router.push("/products");
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "response" in err) {
        setError((err as any).response?.data?.message || "Erreur lors de l'inscription");
      } else {
        setError("Erreur lors de l'inscription");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return {
    user,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout,
    setError,
  };
} 