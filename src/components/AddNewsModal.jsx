import React, { useState } from "react";
import { api } from "../utils/api";

const AddNewsModal = ({ isOpen, closeModal, onNewsAdded }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !image) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);

    try {
      const response = await api.post("/api/news/addnews", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        onNewsAdded(response.data.news); // Notify parent to update list
      }
    } catch (error) {
      setError(error.response?.data.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-xl z-10">
      <div className="bg-white p-8 rounded-xl shadow-xl w-[600px] z-20">
        <h3 className="text-3xl font-bold text-[#0c2d57] mb-6">Add News</h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-xl text-[#0c2d57]" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full p-4 rounded-md bg-[#f4f6f9] text-[#0c2d57] border border-[#0c2d57]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-xl text-[#0c2d57]" htmlFor="content">
              Content
            </label>
            <textarea
              id="content"
              className="w-full p-4 rounded-md bg-[#f4f6f9] text-[#0c2d57] border border-[#0c2d57]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-xl text-[#0c2d57]" htmlFor="image">
              Image
            </label>
            <input
              type="file"
              id="image"
              className="w-full p-4 rounded-md bg-[#f4f6f9] text-[#0c2d57] border border-[#0c2d57]"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={closeModal}
              className="bg-red-500 text-white py-2 px-6 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#00ff88] hover:bg-[#00e67a] text-black py-2 px-6 rounded-md"
            >
              {loading ? "Adding..." : "Add News"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewsModal;
