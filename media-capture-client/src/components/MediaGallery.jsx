import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMedia, deleteMedia } from "../store/slices/mediaSlice";
import { MdDelete } from "react-icons/md";

const MediaGallery = ({ refresh }) => {
  const dispatch = useDispatch();
  const { media, loading } = useSelector((state) => state.media);
  const [selectedMedia, setSelectedMedia] = useState(null); // Track selected media for modal

  useEffect(() => {
    dispatch(fetchMedia());
  }, [dispatch, refresh]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  

  const handleDelete = (key) => {
    dispatch(deleteMedia(key));
  };

  const openModal = (mediaItem) => {
    setSelectedMedia(mediaItem);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  if (loading) return <p className="text-center text-gray-500">Loading media...</p>;

  return (
    <div className="mt-5 container mx-auto px-3 p-5 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">📸 Media Gallery</h2>
      {media.length === 0 ? (
        <p className="text-gray-500 text-center">No media found. Upload something!</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {media.map((item) => (
            <div key={item._id} className="relative bg-white rounded-lg shadow-lg overflow-hidden group">
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt="media"
                  className="w-full h-44 object-cover rounded-lg transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                  onClick={() => openModal(item)}
                />
              ) : (
                <video
                  src={item.url}
                  controls
                  className="w-full h-44 object-cover rounded-lg transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                  onClick={() => openModal(item)}
                />
              )}
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => handleDelete(item.key)}
                  className="cursor-pointer bg-red-500 text-white p-2 rounded-full transition duration-200 hover:bg-red-600"
                >
                  <MdDelete size={20} />
                </button>
              </div>
              <p className="text-center text-xs text-gray-500 mt-2 truncate px-2">{item.key}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal for enlarged view Can use a separate component */}
      {selectedMedia && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative p-5 bg-white rounded-lg shadow-lg max-w-3xl w-full">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 text-lg"
            >
              ✖
            </button>
            <div className="flex justify-center">
              {selectedMedia.type === "image" ? (
                <img src={selectedMedia.url} alt="media" className="w-full max-h-[80vh] object-contain rounded-lg" />
              ) : (
                <video src={selectedMedia.url} controls className="w-full max-h-[80vh] rounded-lg" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;
