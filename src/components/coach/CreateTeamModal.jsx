import React, { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { toast,ToastContainer } from 'react-toastify';
import { api } from '../../utils/api';

const CreateTeamModal = ({ closeModal }) => {
  const [teamName, setTeamName] = useState('');
  const [captainEmail, setCaptainEmail] = useState('');
  const [sportType, setSportType] = useState('cricket');
  const [teamLogo, setTeamLogo] = useState(null);
  const [teamLogoPreview, setTeamLogoPreview] = useState(null);
  const [players, setPlayers] = useState([]);
  const [playerEmail, setPlayerEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/api/user/all', { withCredentials: true });
        setUsers(res.data.users || []); // Ensure we have all users with emails
      } catch (err) {
        console.error('Failed to fetch users', err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (playerEmail.trim()) {
      const filtered = users.filter((user) =>
        user.email.toLowerCase().includes(playerEmail.toLowerCase())
      ).slice(0, 5);  // Limit to 5 results
      setFilteredEmails(filtered);
    } else {
      setFilteredEmails([]);  // Clear when no input
    }
  }, [playerEmail, users]);  // Re-run filtering whenever playerEmail or users changes

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !searchInputRef.current.contains(event.target)
      ) {
        setFilteredEmails([]); // Clear dropdown when clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTeamLogo(file);
      setTeamLogoPreview(URL.createObjectURL(file));
    }
  };

  const handlePlayerSearch = (chosenEmail) => {
    if (!players.includes(chosenEmail)) {
      setPlayers((prev) => [...prev, chosenEmail]);
    }
    setPlayerEmail(''); // Clear the input field after selection
    setFilteredEmails([]); // Close the dropdown
  };

  const handleRemovePlayer = (email) => {
    setPlayers(players.filter((player) => player !== email));
  };

  const handleCreateTeam = async () => {
    if (!teamName || !captainEmail || players.length === 0) {
      setError('Please fill in all fields and add at least one player.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('teamName', teamName);
      formData.append('captainEmail', captainEmail);
      formData.append('sportType', sportType);
      players.forEach((email) => formData.append('playerEmails[]', email)); // Correct way
      if (teamLogo) formData.append('teamLogo', teamLogo);

      await api.post('/api/coach/createTeam', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Team created successfully!');
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to create team.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content bg-[#1a365d] p-6 rounded-lg shadow-xl text-white relative">
        <button
          className="absolute top-2 right-2 text-[#DC3545] hover:text-[#C82333] transition"
          onClick={closeModal}
        >
          <FaTimes />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-[#00ff88] text-center">Create New Team</h2>

        {error && <div className="text-[#DC3545] mb-4">{error}</div>}

        <div className="space-y-4">
          <div>
            <label className="block mb-1">Team Name</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg text-black"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
            />
          </div>

          <div>
            <label className="block mb-1">Captain Email</label>
            <input
              type="email"
              className="w-full p-3 border rounded-lg text-black"
              value={captainEmail}
              onChange={(e) => setCaptainEmail(e.target.value)}
              placeholder="Enter captain email"
            />
          </div>

          <div>
            <label className="block mb-1">Sport Type</label>
            <select
              className="w-full p-3 border rounded-lg text-black"
              value={sportType}
              onChange={(e) => setSportType(e.target.value)}
            >
              <option value="cricket">Cricket</option>
              <option value="kabaddi">Kabaddi</option>
              <option value="hockey">Hockey</option>
            </select>
          </div>

          <div className="relative">
            <label className="block mb-1">Search Player by Email</label>
            <input
              ref={searchInputRef}
              type="text"
              className="w-full p-3 border rounded-lg text-black"
              value={playerEmail}
              onChange={(e) => setPlayerEmail(e.target.value)}
              placeholder="Search player by email"
            />
            {filteredEmails.length > 0 && (
              <ul
                ref={dropdownRef}
                className="absolute bg-[#1a365d] border rounded shadow-md w-full max-h-40 overflow-y-auto z-10"
              >
                {filteredEmails.map((user) => (
                  <li
                    key={user._id}
                    onClick={() => handlePlayerSearch(user.email)}
                    className="px-4 py-2 cursor-pointer hover:bg-[#00ff88] hover:text-black"
                  >
                    {user.email}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-1">Selected Players:</h3>
            <ul>
              {players.map((email, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span>{email}</span>
                  <button
                    className="text-[#DC3545] hover:text-[#C82333]"
                    onClick={() => handleRemovePlayer(email)}
                  >
                    <FaTimes />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label className="block mb-1">Team Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="block w-full p-2 text-sm text-gray-300 bg-[#0f2940] rounded cursor-pointer"
            />
            {teamLogoPreview && (
              <img
                src={teamLogoPreview}
                alt="Team Logo Preview"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <button
            disabled={loading}
            className="bg-[#6C757D] text-white p-3 rounded-lg hover:bg-[#5a6268] disabled:opacity-50"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            disabled={loading}
            className="bg-[#00ff88] text-black p-3 rounded-lg hover:bg-[#00e0c3] disabled:opacity-50"
            onClick={handleCreateTeam}
          >
            {loading ? 'Creating...' : 'Create Team'}
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateTeamModal;
