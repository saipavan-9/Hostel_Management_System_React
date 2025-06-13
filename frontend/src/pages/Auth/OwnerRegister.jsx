import { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./OwnerRegister.css";  // import css

export default function OwnerRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    address: "",
    ownerProof: null,
    hostelProof: null,
  });

  const handleRegister = async () => {
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await api.post("/auth/owner/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Registered successfully. Await admin approval.");
      navigate("/owner/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="page-container">
      <Navbar />
      <div className="register-container">
        <h2>Owner Registration</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="text"
          placeholder="Mobile Number"
          value={form.mobile}
          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <textarea
          placeholder="Address"
          value={form.address}
          rows="3"
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <label>Upload Owner License Proof</label>
        <input
          type="file"
          onChange={(e) => setForm({ ...form, ownerProof: e.target.files[0] })}
        />

        <label>Upload Hostel License Proof</label>
        <input
          type="file"
          onChange={(e) => setForm({ ...form, hostelProof: e.target.files[0] })}
        />

        <button onClick={handleRegister}>Register</button>
      </div>
      <Footer />
    </div>
  );
}
