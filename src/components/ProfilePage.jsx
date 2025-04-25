import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setProfileData } from "../redux/authSlice";
import { api } from "../utils/api";
import AssignRoles from "./AssignRoles";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const profileData = useSelector((state) => state.auth.profileData);

  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dob: "",
    gender: "",
    profileImage: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const isProfileComplete =
    profileData?.name &&
    profileData?.phone &&
    profileData?.dob &&
    profileData?.gender;

  const fetchProfileData = async () => {
    try {
      const res = await api.get("/api/user/details", {
        withCredentials: true,
      });
      dispatch(setProfileData(res.data));
    } catch (err) {
      console.error("Failed to fetch profile data", err);
    }
  };

  useEffect(() => {
    if (user) fetchProfileData();
  }, [dispatch, user]);

  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || "",
        phone: profileData.phone || "",
        dob: profileData.dob ? profileData.dob.slice(0, 10) : "",
        gender: profileData.gender || "",
        profileImage: profileData.profileImage || "",
      });
      setImagePreview(profileData.profileImage || "");
    }
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    data.append("dob", formData.dob);
    data.append("gender", formData.gender);
    if (imageFile) {
      data.append("profileImage", imageFile);
    }

    try {
      const res = await api.put("/api/user/update", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(setProfileData(res.data));
      toast.success("Profile updated successfully!");
      setEditing(false);
      fetchProfileData();
    } catch (err) {
      console.error("Error updating profile", err);
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4 text-white">
      <ToastContainer />
      <h1 className="text-4xl font-bold mb-8 text-center font-serif text-[#00ff88]">
        Welcome, {profileData?.name || user?.email}
      </h1>

      {user?.role === "admin" && (
        <div className="mb-10">
          <AssignRoles />
        </div>
      )}

      {editing ? (
        <form
          onSubmit={handleSubmit}
          className="bg-[#0c2d57] p-6 rounded-2xl shadow-lg space-y-6"
          encType="multipart/form-data"
        >
          <h2 className="text-2xl font-semibold text-[#00ff88] font-sans">
            Update Your Profile
          </h2>
          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex-shrink-0 w-full md:w-1/3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 rounded bg-[#145da0] text-white file:bg-[#00ff88] file:text-black file:border-0"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 mt-4 rounded-full object-cover"
                />
              )}
            </div>

            <div className="flex flex-col gap-4 flex-grow w-full md:w-2/3">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="p-3 rounded bg-[#145da0] text-white placeholder:text-white text-lg"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="p-3 rounded bg-[#145da0] text-white placeholder:text-white text-lg"
              />
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="p-3 rounded bg-[#145da0] text-white text-lg"
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="p-3 rounded bg-[#145da0] text-white text-lg"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#00ff88] text-black px-6 py-2 rounded font-semibold text-lg hover:bg-green-400"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </form>
      ) : (
        <div className="bg-[#0c2d57] p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[#00ff88]">
              Profile Overview
            </h2>
            <button
              className="text-md text-[#00ff88] underline"
              onClick={() => setEditing(true)}
            >
              {isProfileComplete ? "Edit Profile" : "Complete Profile"}
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-10 items-start">
            {profileData?.profileImage && (
              <img
                src={profileData.profileImage}
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-[#00ff88]"
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-lg font-light w-full">
              <p>
                <span className="font-semibold text-[#00ff88]">Email:</span>{" "}
                {profileData?.email}
              </p>
              <p>
                <span className="font-semibold text-[#00ff88]">Name:</span>{" "}
                {profileData?.name || "Not updated"}
              </p>
              <p>
                <span className="font-semibold text-[#00ff88]">Phone:</span>{" "}
                {profileData?.phone || "Not updated"}
              </p>
              <p>
                <span className="font-semibold text-[#00ff88]">DOB:</span>{" "}
                {profileData?.dob
                  ? new Date(profileData.dob).toLocaleDateString()
                  : "Not updated"}
              </p>
              <p>
                <span className="font-semibold text-[#00ff88]">Gender:</span>{" "}
                {profileData?.gender || "Not updated"}
              </p>
              <p>
                <span className="font-semibold text-[#00ff88]">Role:</span>{" "}
                {profileData?.role || user?.role || "Not assigned"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
