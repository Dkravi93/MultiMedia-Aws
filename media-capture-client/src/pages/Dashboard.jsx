import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MediaGallery from "../components/MediaGallery";
import MediaUpload from "../components/MediaUpload";

const Dashboard = () => {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setRefresh((prev) => !prev);
    navigate("/");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-700">Media Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>
      <MediaUpload onUploadSuccess={() => setRefresh((prev) => !prev)} />
      <MediaGallery refresh={refresh} />
    </div>
  );
};

export default Dashboard;
