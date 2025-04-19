import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NewsItem from "./NewsItem";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";
import AddNewsModal from "./AddNewsModal";

const NewsPage = () => {
  const dispatch = useDispatch();
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get("/api/news/view");
        setNewsItems(response.data.news || []);
      } catch (error) {
        console.error("Error fetching news", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleNewsAdded = (newNews) => {
    setNewsItems((prev) => [newNews, ...prev]);
    setModalOpen(false);
  };

  const handleNewsDeleted = (id) => {
    setNewsItems((prev) => prev.filter((news) => news._id !== id));
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1f3d] via-[#0c2d57] to-[#092635] px-4 py-10 text-white">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Latest News</h2>
          {user && (user.role === "admin" || user.role === "organizer") && (
            <button
              onClick={() => setModalOpen(true)}
              className="bg-[#00ff88] hover:bg-[#00e67a] text-black font-semibold py-2 px-5 rounded-md transition ease-in-out duration-300"
            >
              Add News
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-center text-gray-300">Loading news...</p>
        ) : newsItems.length === 0 ? (
          <p className="text-center text-gray-300">No news found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.slice(0, 6).map((news) => (
              <NewsItem
              key={news._id}
              news={news}
              user={user}
              userRole={user?.role}
              onNewsDeleted={handleNewsDeleted}
            />
            
            ))}
          </div>
        )}
      </div>

      <AddNewsModal
        isOpen={modalOpen}
        closeModal={() => setModalOpen(false)}
        onNewsAdded={handleNewsAdded}
      />
    </div>
  );
};

export default NewsPage;
