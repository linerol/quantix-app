import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../services/api";

// Définition du type Product selon la structure attendue
export interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  // Ajoute d'autres champs si besoin
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "response" in err) {
        setError((err as any).response?.data?.message || "Erreur lors du chargement des produits");
      } else {
        setError("Erreur lors du chargement des produits");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
      return;
    }
    fetchProducts();
  }, [router]);

  const addProduct = async (formData: FormData) => {
    setLoading(true);
    setError("");
    try {
      await createProduct(formData);
      await fetchProducts();
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "response" in err) {
        setError((err as any).response?.data?.message || "Erreur lors de l'ajout du produit");
      } else {
        setError("Erreur lors de l'ajout du produit");
      }
    } finally {
      setLoading(false);
    }
  };

  const editProduct = async (id: string, data: FormData | Record<string, any>) => {
    setLoading(true);
    setError("");
    try {
      await updateProduct(id, data);
      await fetchProducts();
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "response" in err) {
        setError((err as any).response?.data?.message || "Erreur lors de la modification du produit");
      } else {
        setError("Erreur lors de la modification du produit");
      }
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      await deleteProduct(id);
      await fetchProducts();
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "response" in err) {
        setError((err as any).response?.data?.message || "Erreur lors de la suppression du produit");
      } else {
        setError("Erreur lors de la suppression du produit");
      }
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, addProduct, editProduct, removeProduct };
} 