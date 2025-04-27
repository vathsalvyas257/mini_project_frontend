import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { toast } from "react-toastify";

const TeamRegister = ({ tournamentId }) => {
  const [teams, setTeams] = useState([]);
  const [registeredTeamIds, setRegisteredTeamIds] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    fetchTeams();
    fetchRegisteredTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await api.get("/api/coach/viewmyTeams");
      setTeams(response.data.teams);
    } catch (err) {
      console.error("Error fetching teams:", err);
      toast.error("Failed to fetch your teams");
    }
  };

  const fetchRegisteredTeams = async () => {
    try {
      const response = await api.get(`/api/tournament/${tournamentId}`);
      const registered = response.data.tournament.registeredTeams.map((entry) => entry.team);
      setRegisteredTeamIds(registered);
    } catch (err) {
      console.error("Error fetching registered teams:", err);
      toast.error("Failed to fetch tournament details");
    }
  };

  const handleRegister = async (teamId) => {
    setIsRegistering(true);
    try {
      await api.post(`/api/tournament/register/${tournamentId}/${teamId}`);
      toast.success("Team registered successfully!");
      // After successful registration, update the registered teams
      setRegisteredTeamIds((prev) => [...prev, teamId]);
    } catch (error) {
      console.error("Error registering team:", error);
      toast.error(error.response?.data?.message || "Failed to register team");
    } finally {
      setIsRegistering(false);
    }
  };

  // Filter out already registered teams
  const availableTeams = teams.filter((team) => !registeredTeamIds.includes(team._id));

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Register Your Team</h3>
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
                className="w-32 h-32 object-cover mb-4 rounded-full"
              />
              <h4 className="text-lg font-semibold text-white">{team.teamName}</h4>
              <button
                onClick={() => handleRegister(team._id)}
                disabled={isRegistering}
                className="mt-4 bg-[#00ff88] hover:bg-[#00e67a] text-black px-4 py-2 rounded"
              >
                {isRegistering ? "Registering..." : "Register Team"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamRegister;
