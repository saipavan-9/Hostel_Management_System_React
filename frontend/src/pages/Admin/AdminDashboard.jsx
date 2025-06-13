import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout";
import React from "react";

export default function AdminDashboard() {
  const { logout } = useAuth();

  return (
    <Layout role="admin">
      <div className="container-fluid min-vh-100 bg-light py-5">
        <h2 className="text-center mb-5 fw-bold fs-2 text-dark">
          Hotel Management Admin Dashboard
        </h2>

        <div className="row align-items-center justify-content-center">
          {/* Image Section */}
          <div className="col-md-4 mb-4 mb-md-0">
            <img
              src="/hostel1.jpeg"
              alt="Hotel Dashboard"
              className="img-fluid rounded shadow w-100"
              style={{ maxHeight: "500px", objectFit: "cover" }}
            />
          </div>

          {/* Content Section */}
          <div className="col-md-5">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="fs-4 fw-semibold mb-3 text-dark">System Overview</h3>
              <p className="text-secondary mb-3">
                Welcome to the Admin Panel of the Hotel Management System. Here you can efficiently manage all hotel operations including reservations, guest check-ins and check-outs, room availability, and financial tracking.
              </p>
              <p className="text-secondary mb-3">
                Utilize this dashboard to handle customer inquiries, monitor staff schedules, and generate comprehensive performance reports. Your centralized control center ensures smooth operation and exceptional guest experiences.
              </p>
              <button 
                onClick={logout} 
                className="btn btn-danger">
                Logout
              </button>
            </div>
          </div>
        </div>

        <footer className="mt-5 text-center text-secondary small">
          &copy; 2025 Hotel Management System. All rights reserved.
        </footer>
      </div>
    </Layout>
  );
}
