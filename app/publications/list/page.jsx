"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PublicationAPI } from "@/app/services/api";

export default function PublicationList() {
  const router = useRouter();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const fetchPublications = async () => {
      setLoading(true);
      try {
        const response = await PublicationAPI.list(`?page=${page}`);
        setPublications(response.data.results || []);
        setCount(response.data.count || 0);
        console.log(response.data.results)
      } catch (err) {
        toast.error("Failed to load publications");
      } finally {
        setLoading(false);
      }
    };
    fetchPublications();
  }, [page]);

  const totalPages = Math.ceil(count / pageSize);

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow"
      >
        <h1 className="text-2xl font-bold mb-6">📚 Publications</h1>

        {loading ? (
          <p className="text-gray-500">Loading publications...</p>
        ) : publications.length === 0 ? (
          <p className="text-gray-500">No publications found.</p>
        ) : (
          <>
            {/* Publication Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {publications.map((pub) => (
                <motion.div
                  key={pub.id}
                  whileHover={{ scale: 1.02 }}
                  className="border p-4 rounded-lg shadow-sm bg-gray-50 cursor-pointer hover:bg-gray-100"
                  onClick={() => router.push(`/publications/${pub.id}`)}
                >
                  <h2 className="text-lg font-semibold text-blue-600">
                    {pub.title}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {pub.abstract}
                  </p>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>{pub.publication_date}</span>
                    <span> {pub.author}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-6 space-x-2">
                <button
                  className={`px-3 py-1 rounded-md border ${
                    page === 1
                      ? "text-gray-400 border-gray-300 cursor-not-allowed"
                      : "text-blue-600 border-blue-500 hover:bg-blue-100"
                  }`}
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.1 }}
                    className={`px-3 py-1 rounded-md border ${
                      page === i + 1
                        ? "bg-blue-600 text-white border-blue-600"
                        : "text-blue-600 border-blue-400 hover:bg-blue-100"
                    }`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </motion.button>
                ))}

                <button
                  className={`px-3 py-1 rounded-md border ${
                    page === totalPages
                      ? "text-gray-400 border-gray-300 cursor-not-allowed"
                      : "text-blue-600 border-blue-500 hover:bg-blue-100"
                  }`}
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
