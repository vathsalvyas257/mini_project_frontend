import React, { useState } from 'react';
import CreateTeamModal from './CreateTeamModal';
import ViewMyTeams from './ViewTeams';  // Ensure this file is correctly named and imported
import { FaPlus, FaList } from 'react-icons/fa';

const CoachDashboard = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  const handleCreateTeamClick = () => {
    setActiveComponent('createTeam');
  };

  const handleViewTeamsClick = () => {
    setActiveComponent('viewTeams');
  };

  const handleCloseModal = () => {
    setActiveComponent(null);
  };

  return (
    <div className="coach-dashboard p-6 bg-gradient-to-br from-[#0a1f3d] via-[#0c2d57] to-[#092635] rounded-lg">
      <h1 className="text-2xl font-bold text-[#00ff88] mb-6 text-center">Coach Dashboard</h1>

      <div className="options grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Create Team Button */}
        <button
          className="btn flex items-center justify-center bg-[#00ff88] text-black p-4 rounded-lg hover:bg-[#00e67a] transition duration-300"
          onClick={handleCreateTeamClick}
        >
          <FaPlus className="mr-2" /> Create Team
        </button>
        
        {/* View Teams Button */}
        <button
          className="btn flex items-center justify-center bg-[#00ff88] text-black p-4 rounded-lg hover:bg-[#00e67a] transition duration-300"
          onClick={handleViewTeamsClick}
        >
          <FaList className="mr-2" /> View My Teams
        </button>
      </div>

      {/* Dynamic Component Rendering */}
      <div className="mt-8">
        {activeComponent === 'createTeam' && <CreateTeamModal closeModal={handleCloseModal} />}
        {activeComponent === 'viewTeams' && <ViewMyTeams />}
      </div>
    </div>
  );
};

export default CoachDashboard;
