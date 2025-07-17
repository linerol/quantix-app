import React, { useState, useEffect } from "react";
import { PlusIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useProducts } from "../hooks/useProducts";

interface ProductFormProps {
  mode: "create" | "edit";
  initialData?: {
    _id?: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ProductForm({ mode, initialData, onSuccess, onCancel }: ProductFormProps) {
  const { addProduct, editProduct, loading } = useProducts();
  const [form, setForm] = useState({
    name: initialData?.name || "",
    price: initialData?.price?.toString() || "",
    quantity: initialData?.quantity?.toString() || "",
    image: null as File | null,
  });
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialData?.imageUrl);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        name: initialData.name,
        price: initialData.price.toString(),
        quantity: initialData.quantity.toString(),
        image: null,
      });
      setImageUrl(initialData.imageUrl);
    }
  }, [mode, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setForm((f) => ({ ...f, image: files[0] }));
      setImageUrl(files[0] ? URL.createObjectURL(files[0]) : undefined);
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "create") {
        // Création : toujours multipart
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("price", form.price);
        formData.append("quantity", form.quantity);
        if (form.image) formData.append("image", form.image);
        await addProduct(formData);
        toast.success("Produit ajouté avec succès");
      } else if (mode === "edit" && initialData?._id) {
        // Edition : JSON si pas d'image, sinon multipart
        let hasImage = !!form.image;
        if (hasImage) {
          const formData = new FormData();
          formData.append("name", form.name);
          formData.append("price", form.price);
          formData.append("quantity", form.quantity);
          formData.append("image", form.image!);
          await editProduct(initialData._id, formData);
        } else {
          // On n'envoie que les champs modifiés
          const patch: Record<string, any> = {};
          if (form.name !== initialData.name) patch.name = form.name;
          if (form.price !== initialData.price.toString()) patch.price = Number(form.price);
          if (form.quantity !== initialData.quantity.toString()) patch.quantity = Number(form.quantity);
          // imageUrl n'est jamais envoyé ici
          if (Object.keys(patch).length === 0) {
            toast.info("Aucune modification détectée");
            setSubmitting(false);
            return;
          }
          await editProduct(initialData._id, patch);
        }
        toast.success("Produit modifié avec succès");
      }
      if (onSuccess) setTimeout(onSuccess, 1200);
    } catch {
      toast.error("Erreur lors de la soumission du produit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <ToastContainer position="top-right" autoClose={3000} />
      <div>
        <label className="block mb-1 font-medium text-gray-900">Nom du produit</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border border-black/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white placeholder-gray-400"
          placeholder="Nom du produit"
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 font-medium text-gray-900">Prix (€)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full border border-black/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white placeholder-gray-400"
            placeholder="Prix"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-medium text-gray-900">Quantité</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            required
            min="0"
            step="1"
            className="w-full border border-black/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white placeholder-gray-400"
            placeholder="Stock"
          />
        </div>
      </div>
      <div>
        <label className="block mb-1 font-medium text-gray-900">Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full border border-black/20 rounded-md px-3 py-2 bg-white text-gray-900"
        />
        {imageUrl && (
          <img src={imageUrl} alt="Produit" className="h-24 w-24 object-cover rounded mt-2 border" />
        )}
      </div>
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          disabled={loading || submitting}
          className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 transition rounded-md font-semibold text-white shadow-md text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mode === "create" ? (
            <span className="flex items-center gap-2 justify-center"><PlusIcon className="h-5 w-5" />Ajouter</span>
          ) : (
            <span className="flex items-center gap-2 justify-center"><PencilSquareIcon className="h-5 w-5" />Enregistrer</span>
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 transition rounded-md font-semibold text-gray-700 shadow text-lg"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
} 