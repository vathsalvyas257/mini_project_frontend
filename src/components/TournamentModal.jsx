import React, { useState } from "react";
import { api } from "../utils/api";
import { toast } from "react-toastify";
import TeamRegister from "./coach/TeamRegister";
import Teamapproval from "./Teamapproval";

const TournamentModal = ({
  tournament,
  onClose,
  onDelete,
  onUpdate,
  userRole,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: tournament.title,
    description: tournament.description,
    startDate: new Date(tournament.startDate).toISOString().split("T")[0],
    sportType: tournament.sportType,
    status: tournament.status,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(tournament.image);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`api/tournament/delete/${tournament._id}`);
      toast.success("Tournament deleted successfully");
      onDelete(tournament._id);
      onClose();
    } catch (error) {
      console.error("Error deleting tournament:", error);
      toast.error("Failed to delete tournament");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("startDate", formData.startDate);
      formDataToSend.append("sportType", formData.sportType);
      formDataToSend.append("status", formData.status);

      if (selectedImage) {
        formDataToSend.append("image", selectedImage);
      }

      const response = await api.put(
        `api/tournament/update/${tournament._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Tournament updated successfully");
      onUpdate(response.data.tournament);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating tournament:", error);
      toast.error(
        error.response?.data?.message || "Failed to update tournament"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const getStatusBadge = (status) => {
    const statusClasses = {
      Upcoming: "bg-blue-500 text-white",
      Ongoing: "bg-yellow-500 text-black",
      Completed: "bg-green-500 text-white",
    };
    return (
      <span
        className={`text-xs px-2 py-1 rounded-full ${statusClasses[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1a365d] rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#0a1f3d]">
        <div className="p-6 text-white">
          {!isEditing ? (
            <>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{tournament.title}</h2>
                <div className="flex gap-2">
                  {getStatusBadge(tournament.status)}
                  <span className="bg-[#0c2d57] text-white text-xs px-2 py-1 rounded-full">
                    {tournament.sportType}
                  </span>
                </div>
              </div>

              {previewImage && (
                <img
                  src={previewImage}
                  alt={tournament.title}
                  className="w-full h-64 object-cover rounded-lg mb-4 border border-[#0a1f3d]"
                />
              )}

              <p className="text-gray-300 mb-4">{tournament.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-400">
                    Start Date
                  </h4>
                  <p>{new Date(tournament.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">
                    Teams Registered
                  </h4>
                  <p>{tournament.registeredTeams?.length || 0}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full bg-[#0c2d57] border border-[#0a1f3d] text-white p-2 rounded"
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
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full bg-[#0c2d57] border border-[#0a1f3d] text-white p-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Sport Type
                    </label>
                    <select
                      name="sportType"
                      value={formData.sportType}
                      onChange={handleInputChange}
                      className="w-full bg-[#0c2d57] border border-[#0a1f3d] text-white p-2 rounded"
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
            </>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-[#0a1f3d]">
            {!isEditing ? (
              <>
                {(userRole === "admin" || userRole === "organizer") && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded"
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
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleUpdate}
                  className="bg-[#00ff88] hover:bg-[#00e67a] text-black px-4 py-2 rounded disabled:opacity-50"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedImage(null);
                    setPreviewImage(tournament.image);
                    setFormData({
                      title: tournament.title,
                      description: tournament.description,
                      startDate: new Date(tournament.startDate)
                        .toISOString()
                        .split("T")[0],
                      sportType: tournament.sportType,
                      status: tournament.status,
                    });
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#0a1f3d]">
            {userRole === "coach" && !isEditing && (
              <div className="mt-6">
                <TeamRegister tournamentId={tournament._id} />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#0a1f3d]">
            {userRole === "organizer" && !isEditing && (
              <div className="mt-6">
                <Teamapproval tournamentId={tournament._id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentModal;
