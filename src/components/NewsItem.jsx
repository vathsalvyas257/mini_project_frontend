import React, { useState } from 'react';
import NewsModal from './NewsModal';

const NewsItem = ({ news, onNewsDeleted,user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id) => {
    onNewsDeleted?.(id); // notify NewsPage to update state
    setIsModalOpen(false); // close modal
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-xs h-[350px] flex flex-col cursor-pointer"
      >
        {news.image && (
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-[50%] object-cover"
          />
        )}

        <div className="flex flex-col p-3 h-[50%]">
          <h3 className="text-lg font-semibold text-[#0c2d57] line-clamp-1 flex-shrink-0">
            {news.title}
          </h3>
          <p className="text-gray-600 text-sm mt-1 line-clamp-3 flex-grow overflow-hidden">
            {news.content}
          </p>
          <div className="mt-auto">
            <p className="text-gray-400 text-xs">
              createdAt: {new Date(news.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <NewsModal
          news={news}
          onClose={() => setIsModalOpen(false)}
          onEdit={() => {}}
          onDelete={handleDelete} 
          userRole={user?.role}
        />
      )}
    </>
  );
};

export default NewsItem;