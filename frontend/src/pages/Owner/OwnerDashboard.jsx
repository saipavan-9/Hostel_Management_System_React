import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await api.get("/owner/dashboard/stats", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log("Stats:", res.data);
      setStats(res.data);
    } catch (err) {
      console.error("Stats fetch error:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Layout role="owner">
      <div className="container mt-4">
        <h2 className="mb-4">📊 Owner Dashboard</h2>

        {!stats ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p>Loading stats...</p>
          </div>
        ) : (
          <>
            <div className="row mb-4">
              <div className="col-md-4">
                <div className="card text-white bg-primary mb-3">
                  <div className="card-header">Total Rooms</div>
                  <div className="card-body">
                    <h3 className="card-title">{stats.totalRooms}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-white bg-success mb-3">
                  <div className="card-header">Total Residents</div>
                  <div className="card-body">
                    <h3 className="card-title">{stats.totalResidents}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-white bg-warning mb-3">
                  <div className="card-header">Revenue</div>
                  <div className="card-body">
                    <h3 className="card-title">₹ {stats.revenue}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="card mb-3">
                  <div className="card-header">Our Services</div>
                  <div className="card-body">
                    <ul>
                      <li>24/7 Customer Support</li>
                      <li>Automated Booking Management</li>
                      <li>Real-time Payment Tracking</li>
                      <li>Maintenance Request Handling</li>
                      <li>Resident Communication Portal</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card mb-3">
                  <div className="card-header">Terms & Conditions</div>
                  <div className="card-body">
                    <p>
                      By using this platform, you agree to follow all local housing regulations and policies.
                      Ensure that all resident information is kept confidential. Any misuse of the platform 
                      may lead to suspension of services. Payments must be processed securely via authorized channels.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
