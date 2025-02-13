import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MediaGallery from "../components/MediaGallery";
import MediaUpload from "../components/MediaUpload";

const Dashboard = () => {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-700">Media Dashboard</h1>
      <MediaUpload onUploadSuccess={() => setRefresh((prev) => !prev)} />
      <MediaGallery refresh={refresh} />
    </div>
  );
};

export default Dashboard;
