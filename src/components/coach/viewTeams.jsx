import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewTeams = () => {
  const [teams, setTeams] = useState([]);
  const [isConfirming, setIsConfirming] = useState(null); // Track which team is being confirmed for deletion

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await api.get('/api/coach/viewmyTeams');
      setTeams(response.data.teams);
    } catch (err) {
      console.error('Error fetching teams:', err);
    }
  };

  const handleDelete = async (teamId) => {
    setIsConfirming(teamId); // Show confirmation for the selected team

  };

  const confirmDelete = async (teamId) => {
    try {
      await api.delete(`/api/coach/delete/${teamId}`);
      // Remove deleted team from state
      setTeams((prevTeams) => prevTeams.filter(team => team._id !== teamId));
      toast.success('Team deleted successfully!'); // Show success toast
      setIsConfirming(null); // Hide confirmation
    } catch (err) {
      console.error('Error deleting team:', err);
      toast.error('Failed to delete team'); // Show error toast
      setIsConfirming(null); // Hide confirmation
    }
  };

  const cancelDelete = () => {
    setIsConfirming(null); // Hide confirmation
  };

  return (
    <div className="view-teams bg-gradient-to-br from-[#0a1f3d] via-[#0c2d57] to-[#092635] min-h-screen p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">My Teams</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.length > 0 ? (
          teams.map((team) => (
            <div key={team._id} className="flex items-center justify-between p-4 bg-[#0a1f3d] rounded-lg shadow-sm hover:shadow-md transition">
              
              {/* Left part: Logo + Info */}
              <div className="flex items-center">
                {/* Team Logo Circle */}
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-blue-300">
                  {team.teamLogo ? (
                    <img 
                      src={team.teamLogo} 
                      alt={team.teamName} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="text-blue-600 font-bold text-2xl">
                      {team.teamName.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Team Info */}
                <div className="ml-5">
                  <h3 className="text-lg font-semibold text-blue-700">{team.teamName}</h3>
                  <p className="text-sm text-gray-400 capitalize">Sport: {team.sportType}</p>
                </div>
              </div>

              {/* Right part: Delete Button or Confirmation */}
              {isConfirming === team._id ? (
                <div className="flex space-x-3">
                  <button 
                    onClick={() => confirmDelete(team._id)}
                    className="text-red-500 hover:text-red-700 font-semibold text-sm border border-red-500 px-3 py-1 rounded-lg transition"
                  >
                    Confirm Delete
                  </button>
                  <button 
                    onClick={cancelDelete}
                    className="text-gray-500 hover:text-gray-700 font-semibold text-sm border border-gray-500 px-3 py-1 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => handleDelete(team._id)}
                  className="text-red-500 hover:text-red-700 font-semibold text-sm border border-red-500 px-3 py-1 rounded-lg transition"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400">No teams created yet.</p>
        )}
      </div>

      {/* Toast Container for Success/Failure messages */}
      <ToastContainer />
    </div>
  );
};

export default ViewTeams;
