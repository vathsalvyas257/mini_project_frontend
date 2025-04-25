import React, { useState } from "react";
import { api } from "../utils/api";
import { toast } from "react-toastify";

const NewsModal = ({ news, onClose, onEdit, onDelete, userRole }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(news.title);
  const [editContent, setEditContent] = useState(news.content);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(news.image);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/api/news/delnews/${news._id}`);
      toast.success("News deleted successfully!");
      onDelete?.(news._id);
      onClose(); // Close modal after deletion
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
      
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await api.put(
        `/api/news/updatenews/${news._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("News updated successfully!");
      
      // Update local state with new data
      setPreviewImage(response.data.news.image);
      setEditTitle(response.data.news.title);
      setEditContent(response.data.news.content);
      
      // Close the modal after successful update
      setIsEditing(false);
      
      // Notify parent component about the update and trigger refresh
      if (onEdit) {
        onEdit(response.data.news);
      } else {
        onClose(); // Fallback if onEdit not provided
      }
    } catch (error) {
      console.error("Error updating news:", error);
      toast.error(error.response?.data?.message || "Failed to update news.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create preview URL for the new image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center px-4">
      <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 relative">
        {!isEditing ? (
          <>
            <h2 className="text-2xl font-bold text-[#0c2d57] mb-2">{editTitle}</h2>
            {previewImage && (
              <img
                src={previewImage}
                alt={editTitle}
                className="w-full h-60 object-cover rounded mb-4"
              />
            )}
            <p className="text-gray-700 mb-4">{editContent}</p>
            <p className="text-gray-400 text-sm mb-6">
              Created At: {new Date(news.createdAt).toLocaleString()}
            </p>
          </>
        ) : (
          <>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full border border-gray-300 p-2 mb-2 rounded text-gray-800 bg-white"
              placeholder="News Title"
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full border border-gray-300 p-2 mb-4 rounded text-gray-800 bg-white"
              rows={4}
              placeholder="News Content"
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Update Image (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {previewImage && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Preview:</p>
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-40 object-contain mt-1 border rounded"
                  />
                </div>
              )}
            </div>
          </>
        )}

        <div className="flex justify-end gap-3">
          {!isEditing ? (
            <>
              {(userRole === "admin" || userRole === "organizer") && (
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
                onClick={() => {
                  setIsEditing(false);
                  setSelectedImage(null);
                  setPreviewImage(news.image); // Reset to original image
                }}
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