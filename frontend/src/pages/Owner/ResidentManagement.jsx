import { useEffect, useState } from "react";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout";

export default function ResidentManagement() {
  const { user } = useAuth();
  const [hostelId, setHostelId] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [residents, setResidents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    checkInDate: "",
  });

  const fetchHostelAndRooms = async () => {
    try {
      const hostelRes = await api.get("/owner/hostel", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setHostelId(hostelRes.data._id);

      const roomsRes = await api.get(`/owner/rooms/${hostelRes.data._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setRooms(roomsRes.data);
    } catch (err) {
      console.error("Error fetching hostel/rooms");
    }
  };

  const fetchResidents = async (id) => {
    try {
      const res = await api.get(`/owner/residents/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setResidents(res.data);
    } catch (err) {
      console.error("Error fetching residents");
    }
  };

  const handleAddResident = async () => {
    try {
      await api.post(
        "/owner/residents",
        { ...form, roomId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      fetchResidents(roomId);
      setForm({ name: "", mobile: "", email: "", checkInDate: "" });
    } catch (err) {
      alert("Failed to add resident");
    }
  };

  useEffect(() => {
    fetchHostelAndRooms();
  }, []);

  useEffect(() => {
    if (roomId) fetchResidents(roomId);
  }, [roomId]);

  return (
    <div>
      <Layout role="owner">
      <h3>Resident Management</h3>

      <label>Select Room:</label>
      <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
        <option value="">-- Select --</option>
        {rooms.map((room) => (
          <option key={room._id} value={room._id}>
            {room.roomNumber} ({room.type})
          </option>
        ))}
      </select>

      {roomId && (
        <>
          <h4>Add Resident to Room {roomId}</h4>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          /><br />
          <input
            type="text"
            placeholder="Mobile"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          /><br />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          /><br />
          <input
            type="date"
            placeholder="Check-in Date"
            value={form.checkInDate}
            onChange={(e) => setForm({ ...form, checkInDate: e.target.value })}
          /><br />
          <button onClick={handleAddResident}>Add Resident</button>

          <h4>Residents in Room</h4>
          {residents.length === 0 ? (
            <p>No residents found</p>
          ) : (
            residents.map((res) => (
              <div key={res._id}>
                <p>{res.name} - {res.mobile} - {res.email}</p>
              </div>
            ))
          )}
        </>
      )}
      </Layout>
    </div>
  );
}
