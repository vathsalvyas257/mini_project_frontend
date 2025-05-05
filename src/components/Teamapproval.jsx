import React, { useState, useEffect } from 'react';
import { api } from "../utils/api"; // assuming you have an api instance set up
import { toast } from 'react-toastify';

export default function TeamApproval({ tournamentId }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the registered teams for the tournament
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await api.get(`/api/tournament/${tournamentId}/teams`);
        setTeams(response.data);
      } catch (error) {
        toast.error("Failed to fetch teams");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [tournamentId]);

  // Handle approve or reject action for a team
  const handleApproval = async (teamId, action) => {
    try {
      const status = action ? 'Accepted' : 'Rejected';
      const response = await api.patch(`/api/tournament/${tournamentId}/teams/${teamId}`, { status });
      
      // Update the local state to reflect the updated status
      setTeams(prevTeams => prevTeams.map(team => 
        team.team._id === teamId ? { ...team, status, approved: true } : team
      ));

      toast.success(`Team ${status.toLowerCase()} successfully.`);
    } catch (error) {
      toast.error("Failed to update team status");
    }
  };

  // Undo action for a team
  const handleUndo = async (teamId) => {
    try {
      const response = await api.patch(`/api/tournament/${tournamentId}/teams/${teamId}`, { status: 'Pending' });
      
      // Revert the status and remove the 'approved' flag to re-enable the buttons
      setTeams(prevTeams => prevTeams.map(team => 
        team.team._id === teamId ? { ...team, status: 'Pending', approved: false } : team
      ));

      toast.success("Action undone. Team status is now pending.");
    } catch (error) {
      toast.error("Failed to undo action");
    }
  };

  if (loading) {
    return <div>Loading teams...</div>;
  }

  return (
    <div className="team-approval-container">
      <h2 className="text-xl font-bold text-white mb-4">Team Approvals</h2>
      {teams.length === 0 ? (
        <p className="text-gray-400">No teams registered yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div 
              key={team.team._id} 
              className={`flex flex-col items-center p-4 rounded-lg shadow-md border ${team.status === 'Accepted' ? 'border-green-500' : team.status === 'Rejected' ? 'border-red-500' : 'border-[#0a1f3d]'}`}
            >
              <img
                src={team.team.teamLogo}
                alt={team.team.teamName}
                className="w-24 h-24 object-cover rounded-full mb-2"
              />
              <h3 className="text-lg font-semibold text-white mb-2">{team.team.teamName}</h3>
              {team.status === 'Pending' ? (
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => handleApproval(team.team._id, true)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleApproval(team.team._id, false)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleUndo(team.team._id)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded mt-2"
                >
                  Undo
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
