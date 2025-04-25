import React, { useState } from "react";
import NewsModal from "./NewsModal";

const NewsItem = ({ news, userRole, onNewsDeleted, onNewsUpdated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="bg-[#1a365d] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {news.image && (
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4">
          <h3 className="text-xl font-bold mb-2 line-clamp-2">{news.title}</h3>
          <p className="text-gray-300 line-clamp-3 mb-4">{news.content}</p>
          <div className="flex justify-between items-center text-sm text-gray-400">
            <span>
              {new Date(news.createdAt).toLocaleDateString()}
            </span>
            {(userRole === "admin" || userRole === "organizer") && (
              <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                {userRole}
              </span>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <NewsModal
          news={news}
          onClose={() => setIsModalOpen(false)}
          onDelete={onNewsDeleted}
          onEdit={onNewsUpdated}
          userRole={userRole}
        />
      )}
    </>
  );
};

export default NewsItem;