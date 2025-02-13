import { useState } from "react";
import axios from "axios";

const MediaUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      console.log("yyyyyyyy", token);
      

      const { data } = await axios.post("http://localhost:5000/api/media/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,  // Send JWT token
        },
      });
      console.log("Upload response:", data);
      
      setMessage("Upload successful!");
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700">Upload Media</h2>
      <input type="file" onChange={handleFileChange} className="mt-4 p-2 border rounded w-full" />
      <button
        onClick={uploadFile}
        disabled={loading}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
      {message && <p className="mt-2 text-center text-green-600">{message}</p>}
    </div>
  );
};

export default MediaUpload;
