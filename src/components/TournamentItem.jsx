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
        className="bg-[#1a365d] min-h-[460px] rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {tournament.image && (
          <img
            src={tournament.image}
            alt={tournament.title}
            className="w-full h-60 object-cover" // increased height
          />
        )}
        <div className="py-6 px-4"> {/* increased vertical padding */}
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-white line-clamp-2">
              {tournament.title}
            </h3>
            {getStatusBadge(tournament.status)}
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-blue-500 text-white text-xs px-2 py-[6px] rounded">
              {tournament.sportType}
            </span>
            <span className="text-xs text-gray-300">
              {tournament.registeredTeams?.length || 0} teams registered
            </span>
          </div>
          <p className="text-gray-300 text-sm mb-4 line-clamp-3">
            {tournament.description}
          </p>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">
              Starts: {new Date(tournament.startDate).toLocaleDateString()}
            </span>
            {userRole === "admin" || userRole === "organizer" ? (
              <span className="bg-blue-500 text-white text-xs px-2 py-[6px] rounded">
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
