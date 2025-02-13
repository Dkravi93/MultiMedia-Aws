import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MediaGallery from "../components/MediaGallery";
import MediaUpload from "../components/MediaUpload";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-semibold text-gray-700">Media Dashboard</h1>
        <MediaUpload />
        <MediaGallery />
      </div>
  );
};

export default Dashboard;
