import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { toast } from "react-toastify";

const TeamRegister = ({ tournamentId, userRole }) => {
  const [teams, setTeams] = useState([]);
  const [registeredTeamIds, setRegisteredTeamIds] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showTeamSelection, setShowTeamSelection] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  useEffect(() => {
    fetchRegisteredTeams();
  }, []);

  const fetchRegisteredTeams = async () => {
    try {
      const response = await api.get(`/api/tournament/${tournamentId}`);
      const registered = response.data.tournament.registeredTeams.map((entry) => entry.team);
      setRegisteredTeamIds(registered);
    } catch (err) {
      console.error("Error fetching registered teams:", err);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await api.get("/api/coach/viewmyTeams");
      setTeams(response.data.teams);
    } catch (err) {
      console.error("Error fetching teams:", err);
      toast.error("Failed to fetch your teams");
    }
  };

  const handleRegister = async () => {
    if (!selectedTeamId) {
      toast.error("Please select a team to register.");
      return;
    }

    setIsRegistering(true);
    try {
      await api.post(`/api/tournament/register/${tournamentId}/${selectedTeamId}`);
      toast.success("Team registered successfully!");

      // Update state after registration
      setRegisteredTeamIds((prev) => [...prev, selectedTeamId]);
      setTeams((prevTeams) => prevTeams.filter(team => team._id !== selectedTeamId)); // Remove registered team
      setShowTeamSelection(false);
      setSelectedTeamId(null);
    } catch (error) {
      console.error("Error registering team:", error);
      toast.error(error.response?.data?.message || "Failed to register team");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSelectTeam = (teamId) => {
    setSelectedTeamId(teamId);
  };

  const availableTeams = teams.filter((team) => !registeredTeamIds.includes(team._id));

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Register Your Team</h3>

      {!showTeamSelection ? (
        <button
          onClick={() => {
            setShowTeamSelection(true);
            fetchTeams();
          }}
          className="bg-[#00ff88] hover:bg-[#00e67a] text-black px-4 py-2 rounded"
        >
          Register Team
        </button>
      ) : (
        <div>
          <h4 className="text-lg font-semibold mb-4">Select Your Team</h4>

          {availableTeams.length === 0 ? (
            <p>No teams available for registration.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {availableTeams.map((team) => (
                <div
                  key={team._id}
                  className="bg-[#1a365d] p-4 rounded-xl shadow-lg border border-[#0a1f3d] flex flex-col items-center"
                >
                  <img
                    src={team.teamLogo || "/default-logo.png"}
                    alt={team.teamName}
                    className="w-24 h-24 object-cover mb-4 rounded-full"
                  />
                  <h4 className="text-lg font-semibold text-white">{team.teamName}</h4>
                  <button
                    onClick={() => handleSelectTeam(team._id)}
                    className="mt-4 bg-[#00ff88] hover:bg-[#00e67a] text-black px-4 py-2 rounded"
                  >
                    {selectedTeamId === team._id ? "Selected" : "Select Team"}
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={handleRegister}
              disabled={isRegistering || !selectedTeamId}
              className="bg-[#00ff88] hover:bg-[#00e67a] text-black px-4 py-2 rounded"
            >
              {isRegistering ? "Registering..." : "Confirm Registration"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamRegister;
