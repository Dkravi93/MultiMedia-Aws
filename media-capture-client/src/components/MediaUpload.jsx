/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";

const MediaUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setProgress(0);
  };

  const uploadFile = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://multimedia-aws.onrender.com/api/media/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percent);
          },
        }
      );

      setMessage("✅ Upload successful!");
      setFile(null);
      onUploadSuccess(); // refresh list
    } catch (error) {
      setMessage(`❌ Upload failed! ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700">Upload Media</h2>
      <input type="file" onChange={handleFileChange} className="mt-4 p-2 border rounded w-full" />
      {progress > 0 && (
        <div className="w-full bg-gray-200 rounded-full mt-2">
          <div
            className="bg-blue-500 text-xs text-white text-center p-0.5 leading-none rounded-full"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      )}
      <button
        onClick={uploadFile}
        disabled={loading}
        className="cursor-pointer mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
      {message && <p className="mt-2 text-center text-green-600">{message}</p>}
    </div>
  );
};

export default MediaUpload;
