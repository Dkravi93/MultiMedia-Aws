import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMedia, deleteMedia } from "../store/slices/mediaSlice";
import { MdDelete } from "react-icons/md"; // Delete Icon

const MediaGallery = () => {
  const dispatch = useDispatch();
  const { media, loading } = useSelector((state) => state.media);

  useEffect(() => {
    dispatch(fetchMedia());
  }, [dispatch]);

  const handleDelete = (key) => {
    dispatch(deleteMedia(key));
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
                <img src={item.url} alt="media" className="w-full h-44 object-cover rounded-lg transition-transform duration-200 group-hover:scale-105" />
              ) : (
                <video src={item.url} controls className="w-full h-44 object-cover rounded-lg transition-transform duration-200 group-hover:scale-105" />
              )}
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => handleDelete(item.key)}
                  className="bg-red-500 text-white p-2 rounded-full transition duration-200 hover:bg-red-600"
                >
                  <MdDelete size={20} />
                </button>
              </div>
              <p className="text-center text-xs text-gray-500 mt-2 truncate px-2">{item.key}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaGallery;
