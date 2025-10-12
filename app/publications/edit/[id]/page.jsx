"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { CategoryAPI } from "@/app/services/api"; // adjust path
import { PublicationAPI } from "@/app/services/api"; // adjust path

export default function PublicationForm() {
  const { id } = useParams(); // ✅ replaces ReactRouterDOM.useParams
  const router = useRouter(); // ✅ replaces ReactRouterDOM.useNavigate
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    content: "",
    categories: [],
    file: null,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catResponse, pubResponse] = await Promise.all([
          CategoryAPI.list(),
          PublicationAPI.detail(id),
        ]);

        if (pubResponse.data.author !== user?.id) {
          throw new Error("Unauthorized");
        }

        setCategories(catResponse.data);
        setFormData({
          title: pubResponse.data.title,
          abstract: pubResponse.data.abstract,
          content: pubResponse.data.content,
          categories: pubResponse.data.categories,
          file: null,
        });
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (user && id) fetchData();
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("abstract", formData.abstract);
    data.append("content", formData.content);
    formData.categories.forEach((cat) => data.append("categories", cat));
    if (formData.file) data.append("file", formData.file);

    try {
      setLoading(true);
      await PublicationAPI.update(id, data);
      router.push("/publications"); // ✅ replaces navigate('/publications')
    } catch (err) {
      setError("Error updating publication");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(value)
        ? prev.categories.filter((cat) => cat !== value)
        : [...prev.categories, value],
    }));
  };

  if (!user) return <ErrorMessage message="Please log in to access this page" />;
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow"
      >
        <h1 className="text-2xl font-bold mb-6">Edit Publication</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Title"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={formData.abstract}
            onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
            placeholder="Abstract"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          />
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Content"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="6"
          />
          <div>
            <p className="font-semibold mb-2">Categories:</p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center">
                  <input
                    type="checkbox"
                    value={cat.name}
                    checked={formData.categories.includes(cat.name)}
                    onChange={() => handleCategoryChange(cat.name)}
                    className="mr-2"
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          </div>
          <input
            type="file"
            onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
