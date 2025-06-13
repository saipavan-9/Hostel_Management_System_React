import { useEffect, useState } from "react";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout";

export default function OwnerApproval() {
  const { user } = useAuth();
  const [pendingOwners, setPendingOwners] = useState([]);

  const fetchPendingOwners = async () => {
    try {
      const res = await api.get("/admin/owners/pending", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPendingOwners(res.data);
    } catch (err) {
      alert("Failed to fetch pending owners");
    }
  };

  const handleApproval = async (id, status) => {
    try {
      await api.put(`/admin/owners/${status}/${id}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchPendingOwners();
    } catch (err) {
      alert("Failed to update owner status");
    }
  };

  useEffect(() => {
    fetchPendingOwners();
  }, []);

  return (
    <div>
        <Layout role="admin">
      
      <h3>Pending Owner Approvals</h3>
      {pendingOwners.length === 0 ? (
        <p>No pending owners.</p>
      ) : (
        pendingOwners.map((owner) => (
          <div key={owner._id} style={{ border: "1px solid #aaa", padding: "10px", marginBottom: "10px" }}>
            <p><b>Name:</b> {owner.fullName}</p>
            <p><b>Email:</b> {owner.email}</p>
            <p><b>Mobile:</b> {owner.mobile}</p>
            <p><b>Address:</b> {owner.address}</p>
            <p><b>Status:</b> {owner.status}</p>
            <img
  src={`http://localhost:5000/uploads/${owner.ownerProof}`}
  alt="Owner Proof"
  width="150"
/>
<br /> <br />
<img
  src={`http://localhost:5000/uploads/${owner.hostelProof}`}
  alt="Hostel Proof"
  width="150"
/>
<br /><br />
            <button onClick={() => handleApproval(owner._id, "approve")}>Approve</button>
            <button onClick={() => handleApproval(owner._id, "reject")}>Reject</button>
          </div>
        ))
      )}
      
        </Layout>
    </div>
  );
}
