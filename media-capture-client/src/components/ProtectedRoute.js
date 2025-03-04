const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return window.location.href = "/";
  }

  return children;
};

export default ProtectedRoute;
