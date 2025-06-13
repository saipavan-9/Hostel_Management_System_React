import { useEffect, useState } from "react";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout";

export default function AdminHostels() {
  const { user } = useAuth();
  const [hostels, setHostels] = useState([]);

  const fetchHostels = async () => {
    try {
      const res = await api.get("/admin/hostels", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setHostels(res.data);
    } catch (err) {
      console.error("Failed to load hostels", err);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  return (
    <Layout role="admin">
      <h2>All Registered Hostels</h2>
      {hostels.length === 0 ? (
        <p>No hostels found.</p>
      ) : (
        hostels.map((hostel) => (
          <div key={hostel._id} style={cardStyle}>
            <h3>{hostel.name}</h3>
            <p><b>Address:</b> {hostel.address}</p>
            <p><b>Description:</b> {hostel.description}</p>
            <p><b>Owner:</b> {hostel.ownerId?.fullName} ({hostel.ownerId?.email})</p>
            <p><b>Revenue (This Month):</b> ₹{hostel.revenue}</p>

            <ResidentsList hostelId={hostel._id} token={user.token} />
          </div>
        ))
      )}
    </Layout>
  );
}

const cardStyle = {
  backgroundColor: "#fff",
  padding: "15px",
  borderRadius: "8px",
  marginBottom: "20px",
  boxShadow: "0 0 5px rgba(0,0,0,0.1)",
};


function ResidentsList({ hostelId, token }) {
  const [residents, setResidents] = useState([]);

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const res = await api.get(`/admin/hostels/${hostelId}/residents`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResidents(res.data);
      } catch (err) {
        console.error("Error loading residents", err);
      }
    };
    fetchResidents();
  }, [hostelId]);

  return (
    <div>
      <h4>Residents:</h4>
      {residents.length === 0 ? (
        <p>No residents yet.</p>
      ) : (
        residents.map((res) => (
          <p key={res._id}>👤 {res.name} — {res.email} — {res.mobile}</p>
        ))
      )}
    </div>
  );
}
