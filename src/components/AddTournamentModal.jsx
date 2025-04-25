import React, { useState } from "react";
import { api } from "../utils/api";
import { toast } from "react-toastify";

const AddTournamentModal = ({ isOpen, onClose, onTournamentAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    sportType: "kabaddi",
    status: "Upcoming"
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("startDate", formData.startDate);
      formDataToSend.append("sportType", formData.sportType);
      formDataToSend.append("status", formData.status);
      
      if (selectedImage) {
        formDataToSend.append("image", selectedImage); // Make sure this matches the multer field name
      }
  
      // Debug: Log form data before sending
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}: ${value}`);
      }
  
      const response = await api.post("api/tournament/create", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      toast.success("Tournament created successfully");
      onTournamentAdded(response.data.tournament);
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error creating tournament:", error);
      // Show more detailed error message
      toast.error(
        error.response?.data?.message || 
        error.response?.data?.errors?.join(", ") || 
        "Failed to create tournament"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      startDate: "",
      sportType: "kabaddi",
      status: "Upcoming"
    });
    setSelectedImage(null);
    setPreviewImage("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1a365d] rounded-xl shadow-lg max-w-2xl w-full text-white">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Create New Tournament</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-[#0c2d57] border border-[#0a1f3d] text-white p-2 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-[#0c2d57] border border-[#0a1f3d] text-white p-2 rounded"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full bg-[#0c2d57] border border-[#0a1f3d] text-white p-2 rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Sport Type *
                  </label>
                  <select
                    name="sportType"
                    value={formData.sportType}
                    onChange={handleInputChange}
                    className="w-full bg-[#0c2d57] border border-[#0a1f3d] text-white p-2 rounded"
                    required
                  >
                    <option value="kabaddi">Kabaddi</option>
                    <option value="hockey">Hockey</option>
                    <option value="cricket">Cricket</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full bg-[#0c2d57] border border-[#0a1f3d] text-white p-2 rounded"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tournament Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-300
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#00ff88] file:text-black
                    hover:file:bg-[#00e67a]"
                />
                {previewImage && (
                  <div className="mt-2">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-40 object-contain mt-1 border border-[#0a1f3d] rounded"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-[#0a1f3d]">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  resetForm();
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#00ff88] hover:bg-[#00e67a] text-black px-4 py-2 rounded disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Tournament"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTournamentModal;