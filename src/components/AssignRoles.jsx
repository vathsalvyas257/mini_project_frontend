import React, { useState, useEffect, useRef } from "react";
import { api } from "../utils/api"; // axios instance with credentials
import { Input, Card, Button } from "./UiComponents";

const AssignRoles = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("coach");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const dropdownRef = useRef(null);

  // Fetch users for autocomplete
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/api/user/all", { withCredentials: true }); // adjust if needed
        setUsers(res.data.users || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  // Filter emails based on input
  useEffect(() => {
    if (email.trim()) {
      const filtered = users
        .filter((u) => u.email.toLowerCase().includes(email.toLowerCase()))
        .slice(0, 5);
      setFilteredEmails(filtered);
    } else {
      setFilteredEmails([]);
    }
  }, [email, users]);

  // Close suggestion box if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setFilteredEmails([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(
        "/api/admin/assign-role",
        { email: selectedEmail || email, role },
        { withCredentials: true }
      );
      setMessage(res.data.message);
      setEmail("");
      setSelectedEmail("");
    } catch (err) {
      setMessage("Failed to assign role");
      console.error(err);
    }
  };

  const handleSelectEmail = (chosenEmail) => {
    setEmail(chosenEmail);
    setSelectedEmail(chosenEmail);
    setFilteredEmails([]); // Close the dropdown after selection
  };

  return (
    <Card className="w-full max-w-md mx-auto my-8 p-6 shadow-lg bg-gradient-to-br from-[#0a1f3d] via-[#0c2d57] to-[#092635] rounded-2xl">
      <h2 className="text-2xl font-bold text-center mb-6 text-[#00ff88]">
        Assign Role
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 relative">
        <Input
          type="email"
          placeholder="Search user by email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setSelectedEmail(""); // Clear selected email when typing
          }}
          required
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ff88] text-white bg-[#1a365d]"
        />
        {filteredEmails.length > 0 && (
          <ul
            ref={dropdownRef}
            className="absolute bg-[#1a365d] border border-[#00ff88] rounded shadow-md w-full max-h-40 overflow-y-auto z-10 mt-1"
          >
            {filteredEmails.map((user) => (
              <li
                key={user._id}
                onClick={() => handleSelectEmail(user.email)}
                className="px-4 py-2 cursor-pointer hover:bg-[#00ff88] hover:text-black text-sm text-white"
              >
                {user.email}
              </li>
            ))}
          </ul>
        )}
        <select
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ff88] bg-[#1a365d] text-white"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="coach">Coach</option>
          <option value="organizer">Organizer</option>
        </select>
        <Button
          type="submit"
          className="w-full bg-[#00ff88] text-black hover:bg-[#00e67a] py-2 rounded-md"
        >
          Assign Role
        </Button>
        {message && (
          <p className="text-center text-[#00ff88] font-medium mt-2">{message}</p>
        )}
      </form>
    </Card>
  );
};

export default AssignRoles;
