import React, { useState } from "react";
import { api } from "../utils/api";
import { toast } from "react-toastify";
import axios from "axios";

const NewsModal = ({ news, onClose, onEdit, onDelete, userRole }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(news.title);
  const [editContent, setEditContent] = useState(news.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/api/news/delnews/${news._id}`, {
        withCredentials: true,
      });
      toast.success("News deleted successfully!");
      onDelete?.(news._id); // call parent to remove news
    } catch (error) {
      console.error("Error deleting news:", error);
      toast.error("Failed to delete news.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("content", editContent);

      await axios.put(`/updatenews/${news._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      toast.success("News updated successfully!");
      onEdit?.();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating news:", error);
      toast.error("Failed to update news.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center px-4">
      <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 relative">
        {!isEditing ? (
          <>
            <h2 className="text-2xl font-bold text-[#0c2d57] mb-2">{news.title}</h2>
            {news.image && (
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-60 object-cover rounded mb-4"
              />
            )}
            <p className="text-gray-700 mb-4">{news.content}</p>
            <p className="text-gray-400 text-sm mb-6">
              Created At: {new Date(news.createdAt).toLocaleString()}
            </p>
          </>
        ) : (
          <>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full border p-2 mb-2 rounded"
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full border p-2 mb-4 rounded"
              rows={4}
            />
          </>
        )}

        <div className="flex justify-end gap-3">
          {!isEditing ? (
            <>
              {(userRole === "admin" || userRole === "organiser") && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Close
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleUpdate}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsModal;
