import { useEffect, useState } from "react";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#00C49F", "#FF8042"];

export default function BillingManagement() {
  const { user } = useAuth();
  const [hostelId, setHostelId] = useState(null);
  const [bills, setBills] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [revenue, setRevenue] = useState(0);

  const fetchHostel = async () => {
    const res = await api.get("/owner/hostel", {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setHostelId(res.data._id);
  };

  const fetchBills = async (id) => {
    const res = await api.get(`/owner/bills/${id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const data = res.data;

    setBills(data);

    const paid = data.filter((b) => b.status === "Paid");
    const unpaid = data.filter((b) => b.status === "Unpaid");

    setRevenue(paid.reduce((sum, b) => sum + b.amount, 0));

    setChartData([
      { name: "Paid", value: paid.length },
      { name: "Unpaid", value: unpaid.length },
    ]);
  };

  const generateBills = async () => {
    try {
      await api.post(`/owner/bills/generate/${hostelId}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchBills(hostelId);
      alert("Bills generated for current month");
    } catch (err) {
      alert("Failed to generate bills");
    }
  };

  const updateStatus = async (billId, status) => {
    try {
      await api.put(`/owner/bills/status/${billId}`, { status }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchBills(hostelId);
    } catch (err) {
      alert("Failed to update bill status");
    }
  };

  const downloadFile = async (type) => {
  const endpoint = type === "pdf" ? "pdf" : "excel";
  try {
    const response = await fetch(`http://localhost:5000/api/owner/export/bills/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `billing-report.${type}`;
    a.click();
  } catch (err) {
    alert("Download failed.");
  }
};


  useEffect(() => {
    fetchHostel().then(() => {
      if (hostelId) fetchBills(hostelId);
    });
  }, [hostelId]);

  return (
    <Layout role="owner">
      <h2>Billing Management</h2>
      <button onClick={generateBills}>Generate Monthly Bills</button>

      <h3 style={{ marginTop: "20px" }}>Total Revenue: ₹{revenue}</h3>

      <div style={{ width: "100%", maxWidth: "600px", height: "300px", marginTop: "20px" }}>
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={chartData}
        cx="50%"
        cy="50%"
        outerRadius={100}
        label
        dataKey="value"
      >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</div>


      <h4 style={{ marginTop: "40px" }}>All Bills</h4>
      {bills.length === 0 ? (
        <p>No bills found</p>
      ) : (
        bills.map((bill) => (
          <div
            key={bill._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              background: bill.status === "Paid" ? "#e6ffe6" : "#fff0f0",
            }}
          >
            <p><b>Resident:</b> {bill.residentId?.name} ({bill.residentId?.email})</p>
            <p><b>Month:</b> {bill.month}</p>
            <p><b>Amount:</b> ₹{bill.amount}</p>
            <p><b>Status:</b> {bill.status}</p>
            <button onClick={() => updateStatus(bill._id, bill.status === "Paid" ? "Unpaid" : "Paid")}>
              Mark as {bill.status === "Paid" ? "Unpaid" : "Paid"}
            </button>
          </div>
        ))
      )}
      <div style={{ marginBottom: "20px" }}>
  <button onClick={() => downloadFile("excel")}>Export to Excel</button>
  <button onClick={() => downloadFile("pdf")} style={{ marginLeft: "10px" }}>Export to PDF</button>
</div>

    </Layout>
  );
}
