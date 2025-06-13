import { useEffect, useState } from "react";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout";

export default function HostelManagement() {
  const { user } = useAuth();
  const [hostel, setHostel] = useState(null);
  const [form, setForm] = useState({
    name: "",
    address: "",
    description: "",
  });

  const fetchHostel = async () => {
    try {
      const res = await api.get("/owner/hostel", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setHostel(res.data);
    } catch (err) {
      console.log("No hostel found");
    }
  };

  const handleCreate = async () => {
    try {
      const res = await api.post("/owner/hostel", form, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setHostel(res.data);
    } catch (err) {
      alert("Failed to create hostel");
    }
  };

  useEffect(() => {
    fetchHostel();
  }, []);

  return (
    <Layout role="owner">
      <h2>Hostel Management</h2>

      {hostel ? (
        <div style={cardStyle}>
          <h3>Your Hostel Details</h3>
          <p><b>Name:</b> {hostel.name}</p>
          <p><b>Address:</b> {hostel.address}</p>
          <p><b>Description:</b> {hostel.description}</p>
        </div>
      ) : (
        <div style={formStyle}>
          <h3>Create Hostel</h3>
          <input
            type="text"
            placeholder="Hostel Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          /><br />
          <input
            type="text"
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          /><br />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          /><br />
          <button onClick={handleCreate}>Create Hostel</button>
        </div>
      )}
    </Layout>
  );
}

const formStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  maxWidth: "500px",
  borderRadius: "10px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
};

const cardStyle = {
  ...formStyle,
  backgroundColor: "#e6f2ff",
};
