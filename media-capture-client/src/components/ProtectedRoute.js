import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  return token ? children : navigate("/dashboard");;
};

export default ProtectedRoute;
