"use client";

import React from "react";
import { useProducts, Product } from "../../hooks/useProducts";
import MainLayout from "../../layouts/MainLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PencilSquareIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ProductForm from "../../components/ProductForm";

export default function ProductsPage() {
  const { products, loading, error, removeProduct } = useProducts();
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState<false | "create" | Product>(false);
  const router = useRouter();

  useEffect(() => {
    setFiltered(
      products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    );
  }, [products, search]);

  const handleDelete = async (id: string) => {
    try {
      await removeProduct(id);
      toast.success("Produit supprimé avec succès");
    } catch {
      toast.error("Erreur lors de la suppression du produit");
    }
  };

  return (
    <MainLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Modale contextuelle */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setModalOpen(false)}
              aria-label="Fermer"
            >
              ×
            </button>
            <h2 className="text-xl font-bold text-purple-700 mb-4 flex items-center gap-2">
              {modalOpen === "create" ? "Ajouter un produit" : `Modifier : ${(modalOpen as Product).name}`}
            </h2>
            <ProductForm
              mode={modalOpen === "create" ? "create" : "edit"}
              initialData={modalOpen !== "create" ? modalOpen : undefined}
              onSuccess={() => setModalOpen(false)}
              onCancel={() => setModalOpen(false)}
            />
          </div>
        </div>
      )}
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-purple-700 tracking-tight">Produits</h1>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-black/20 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
              />
            </div>
            <button
              onClick={() => setModalOpen("create")}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold rounded-md px-4 py-2 shadow transition disabled:opacity-60 disabled:cursor-not-allowed border border-purple-700"
            >
              <PlusIcon className="h-5 w-5" />
              Ajouter un produit
            </button>
          </div>
        </div>
        {loading && <div className="text-center text-purple-600 font-medium animate-pulse">Chargement...</div>}
        {error && <div className="text-center text-red-600 font-semibold mb-4 border border-red-200 bg-red-50 rounded p-2 animate-shake">{error}</div>}
        {!loading && !error && (
          filtered.length === 0 ? (
            <div className="text-center text-gray-500 py-12">Aucun produit trouvé.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
              {filtered.map(product => {
                let badgeColor = "bg-green-100 text-green-700 border-green-300";
                if (product.quantity <= 10) badgeColor = "bg-red-100 text-red-700 border-red-300";
                else if (product.quantity <= 30) badgeColor = "bg-yellow-100 text-yellow-700 border-yellow-300";
                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center gap-3 transition-transform hover:scale-105 border border-purple-50 mx-auto max-w-[250px]"
                  >
                    <div className="flex justify-center items-center h-40 w-full mb-2">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="h-36 w-36 object-cover rounded shadow mx-auto" />
                      ) : (
                        <div className="h-36 w-36 flex items-center justify-center bg-purple-50 rounded text-gray-400 mx-auto">Aucune image</div>
                      )}
                    </div>
                    <div className="flex-1 w-full">
                      <h2 className="font-bold text-lg text-purple-700 mb-1 truncate w-full" title={product.name}>{product.name}</h2>
                      <div className="text-gray-900 font-semibold mb-1">{product.price} €</div>
                      <span className={`inline-block text-xs font-bold px-2 py-1 rounded-full mb-2 border ${badgeColor}`}>
                        {product.quantity} en stock
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-auto w-full">
                      <button
                        className="flex-1 flex items-center justify-center gap-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition rounded px-2 py-1 font-semibold border border-yellow-300"
                        onClick={() => setModalOpen(product)}
                        title="Modifier"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                        Modifier
                      </button>
                      <button
                        className="flex-1 flex items-center justify-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 transition rounded px-2 py-1 font-semibold border border-red-300"
                        onClick={() => handleDelete(product._id)}
                        title="Supprimer"
                      >
                        <TrashIcon className="h-5 w-5" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </MainLayout>
  );
} 