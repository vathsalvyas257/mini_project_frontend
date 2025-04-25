import React, { useState } from "react";
import TournamentModal from "./TournamentModal";

const TournamentItem = ({ tournament, userRole, onDelete, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusBadge = (status) => {
    const statusClasses = {
      Upcoming: "bg-blue-500 text-white",
      Ongoing: "bg-yellow-500 text-white",
      Completed: "bg-green-500 text-white"
    };
    return (
      <span className={`text-xs px-2 py-1 rounded ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <>
      <div 
        className="bg-[#1a365d] rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {tournament.image && (
          <img
            src={tournament.image}
            alt={tournament.title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-white line-clamp-2">
              {tournament.title}
            </h3>
            {getStatusBadge(tournament.status)}
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
              {tournament.sportType}
            </span>
            <span className="text-xs text-gray-300">
              {tournament.registeredTeams?.length || 0} teams registered
            </span>
          </div>
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
            {tournament.description}
          </p>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">
              Starts: {new Date(tournament.startDate).toLocaleDateString()}
            </span>
            {userRole === "admin" || userRole === "organizer" ? (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                {userRole}
              </span>
            ) : (
              <span className="text-gray-400">Player</span>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <TournamentModal
          tournament={tournament}
          onClose={() => setIsModalOpen(false)}
          onDelete={onDelete}
          onUpdate={onUpdate}
          userRole={userRole}
        />
      )}
    </>
  );
};

export default TournamentItem;