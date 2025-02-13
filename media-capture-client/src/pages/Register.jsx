import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [fullname, setfullname] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("https://multimedia-aws.onrender.com/api/auth/register", {
        email,
        password,
        fullname
      });
      localStorage.setItem("token", data.token);
      alert("Registration successful! Please login.");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            value={fullname}
            onChange={(e) => setfullname(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
            Register
          </button>
        </form>
        <p className="mt-4 text-sm">
          Already have an account? <Link to="/" className="text-blue-500">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
