import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Intercepteur pour ajouter le JWT dans les headers
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const register = async (email: string, password: string) => {
  const res = await api.post("/auth/register", { email, password });
  return res.data;
};

export const getProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

export const createProduct = async (formData: FormData) => {
  const res = await api.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateProduct = async (id: string, data: FormData | Record<string, any>) => {
  // Si data est un FormData (cas image), on envoie en multipart
  if (typeof FormData !== 'undefined' && data instanceof FormData) {
    const res = await api.patch(`/products/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } else {
    // Sinon, on envoie en JSON
    const res = await api.patch(`/products/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  }
};

export const deleteProduct = async (id: string) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

export default api; 