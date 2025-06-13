import { useEffect, useState } from "react";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout";

export default function RoomManagement() {
  const { user } = useAuth();
  const [hostelId, setHostelId] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    roomNumber: "",
    type: "Single",
    capacity: 1,
    rent: 0,
  });

  // Fetch hostel ID
  const fetchHostel = async () => {
    const res = await api.get("/owner/hostel", {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setHostelId(res.data._id);
  };

  // Fetch rooms
  const fetchRooms = async (id) => {
    const res = await api.get(`/owner/rooms/${id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setRooms(res.data);
  };

  // Handle room create
  const handleCreateRoom = async () => {
    try {
      await api.post("/owner/rooms", { ...form, hostelId }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setForm({ roomNumber: "", type: "Single", capacity: 1, rent: 0 });
      fetchRooms(hostelId);
    } catch (err) {
      alert("Failed to create room");
    }
  };

  useEffect(() => {
    fetchHostel().then(() => {
      if (hostelId) fetchRooms(hostelId);
    });
  }, [hostelId]);

  return (
    <div>
       <Layout role="owner">
      <h3>Room Management</h3>

      <h4>Add New Room</h4>
      <input
        placeholder="Room Number"
        value={form.roomNumber}
        onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
      /><br />
      <select
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      >
        <option>Single</option>
        <option>Double</option>
        <option>Dorm</option>
      </select><br />
      <input
        type="number"
        placeholder="Capacity"
        value={form.capacity}
        onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) })}
      /><br />
      <input
        type="number"
        placeholder="Rent"
        value={form.rent}
        onChange={(e) => setForm({ ...form, rent: parseInt(e.target.value) })}
      /><br />
      <button onClick={handleCreateRoom}>Add Room</button>

      <h4>All Rooms</h4>
      {rooms.map((room) => (
        <div key={room._id}>
          <p>Room {room.roomNumber} - {room.type} - ₹{room.rent} (Capacity: {room.capacity})</p>
        </div>
      ))}
      </Layout>
    </div>
  );
}
