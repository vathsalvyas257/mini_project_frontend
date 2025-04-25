import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import TournamentItem from "./TournamentItem";
import { api } from "../utils/api";
import AddTournamentModal from "./AddTournamentModal";

const TournamentPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await api.get("api/tournament/view");
        setTournaments(response.data.tournaments || []);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const handleTournamentAdded = (newTournament) => {
    setTournaments((prev) => [newTournament, ...prev]);
    setModalOpen(false);
  };

  const handleTournamentDeleted = (id) => {
    setTournaments((prev) => prev.filter((t) => t._id !== id));
  };

  const handleTournamentUpdated = (updatedTournament) => {
    setTournaments((prev) =>
      prev.map((t) => (t._id === updatedTournament._id ? updatedTournament : t))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1f3d] via-[#0c2d57] to-[#092635] px-4 py-10 text-white">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Tournaments</h2>
          {user && (user.role === "admin" || user.role === "organizer") && (
            <button
              onClick={() => setModalOpen(true)}
              className="bg-[#00ff88] hover:bg-[#00e67a] text-black font-semibold py-2 px-5 rounded-md transition ease-in-out duration-300"
            >
              Create Tournament
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-center text-gray-300">Loading tournaments...</p>
        ) : tournaments.length === 0 ? (
          <p className="text-center text-gray-300">No tournaments available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <TournamentItem
                key={tournament._id}
                tournament={tournament}
                userRole={user?.role}
                onDelete={handleTournamentDeleted}
                onUpdate={handleTournamentUpdated}
              />
            ))}
          </div>
        )}

        <AddTournamentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onTournamentAdded={handleTournamentAdded}
        />
      </div>
    </div>
  );
};

export default TournamentPage;