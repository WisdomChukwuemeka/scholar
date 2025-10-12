"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PublicationAPI, ViewsAPI } from "@/app/services/api";

export default function PublicationDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [publication, setPublication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [dislikeLoading, setDislikeLoading] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  const prevStatus = useRef(null);

  const fetchPublication = async () => {
    try {
      const response = await PublicationAPI.detail(id);
      setPublication(response.data);
      prevStatus.current = response.data.status;
      console.log("Fetched publication:", response.data);
    } catch (err) {
      toast.error("❌ Failed to load publication");
      router.push("/publications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchPublication();
  }, [id]);

  // Poll likes/dislikes every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (id) {
        PublicationAPI.detail(id).then((res) => {
          setPublication((prev) => ({
            ...prev,
            total_likes: res.data.total_likes,
            total_dislikes: res.data.total_dislikes,
          }));
        });
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [id]);

  const handleLike = async () => {
    setLikeLoading(true);
    try {
      await ViewsAPI.like(id);
      toast.success("You liked this publication!");
      await fetchPublication();
    } catch {
      toast.error("You have already liked this publication");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDislike = async () => {
    setDislikeLoading(true);
    try {
      await ViewsAPI.dislike(id);
      toast.info("You disliked this publication!");
      await fetchPublication();
    } catch {
      toast.error("You have already disliked this publication");
    } finally {
      setDislikeLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <span className="badge bg-success">Approved</span>;
      case "under_review":
        return <span className="badge bg-warning text-dark">Under Review</span>;
      case "rejected":
        return <span className="badge bg-danger">Rejected</span>;
      default:
        return <span className="badge bg-secondary">Pending</span>;
    }
  };

  return (
    <div className="p-6 relative">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {loading ? (
        <p className="text-gray-500">Loading publication...</p>
      ) : (
        publication && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow"
            >
              <div className="flex justify-between items-center">
                <button
                  onClick={() => router.back()}
                  className="mb-4 text-blue-600 underline"
                >
                  ← Back
                </button>
                {getStatusBadge(publication.status)}
              </div>

              {/* Display video if available */}
              {publication.video_file ? (
                <div className="mb-4">
                  <video
                    src={publication.video_file}
                    controls
                    className="w-full rounded-lg"
                    style={{ maxHeight: "300px" }}
                    onError={() => toast.error(`Failed to load video for ${publication.title}`)}
                  />
                </div>
              ) : (
                <p className="text-gray-500 text-sm mb-4">No video available</p>
              )}

              <h1 className="text-xl font-bold text-blue-700 text-center">
                {publication.title}
              </h1>

              <h2 className="font-bold mt-4">Abstract</h2>
              <p className="text-gray-600 mb-4 italic">{publication.abstract}</p>

              <div className="mb-4 text-sm text-gray-500">
                <p>Author: {publication.author}</p>
                <p>Categories: {publication.category_labels}</p>
                <p>
                  Published:{" "}
                  {new Date(publication.created_at).toLocaleDateString()}
                </p>
              </div>

              <h2 className="font-bold">Content</h2>
              <div className="prose max-w-none">
                <p>{publication.content}</p>
              </div>

              {publication.status === "rejected" && publication.rejection_note && (
                <div className="mt-6 flex justify-start">
                  <motion.button
                    onClick={() => setShowRejectionModal(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-red-700 shadow transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span
                      animate={{
                        y: [0, -4, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                      }}
                    >
                      📩
                    </motion.span>
                    View Rejection Note
                  </motion.button>
                </div>
              )}

              {publication.file && (
                <div className="mt-4 flex justify-between items-center">
                  <a
                    href={publication.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    📄 View Document
                  </a>

                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <i className="bi bi-eye"></i>
                      <span>{publication.views}</span>
                    </div>

                    <button
                      onClick={handleLike}
                      disabled={likeLoading}
                      className="flex items-center gap-1 text-success hover:text-green-700"
                    >
                      <i className="bi bi-hand-thumbs-up-fill"></i>
                      <span>{publication.total_likes || 0}</span>
                    </button>

                    <button
                      onClick={handleDislike}
                      disabled={dislikeLoading}
                      className="flex items-center gap-1 text-danger hover:text-red-700"
                    >
                      <i className="bi bi-hand-thumbs-down-fill"></i>
                      <span>{publication.total_dislikes || 0}</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            <AnimatePresence>
              {showRejectionModal && (
                <motion.div
                  className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    initial={{ scale: 0.8, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.8, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 p-6 relative"
                  >
                    <button
                      onClick={() => setShowRejectionModal(false)}
                      className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl"
                    >
                      ❌
                    </button>
                    <h2 className="text-lg font-bold text-red-700 mb-2">
                      Rejection Note
                    </h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {publication.rejection_note}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )
      )}
    </div>
  );
}