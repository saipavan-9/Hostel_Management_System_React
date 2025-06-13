import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OwnerLogin from "./pages/Auth/OwnerLogin";
import AdminLogin from "./pages/Auth/AdminLogin";
import OwnerDashboard from "./pages/Owner/OwnerDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import RoomManagement from "./pages/Owner/RoomManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import ResidentManagement from "./pages/Owner/ResidentManagement";
import BillingManagement from "./pages/Owner/BillingManagement";
import OwnerApproval from "./pages/Admin/OwnerApproval";
import Landing from "./pages/Landing";
import OwnerRegister from "./pages/Auth/OwnerRegister";
import HostelManagement from "./pages/Owner/HostelManagement";
import AdminHostels from "./pages/Admin/AdminHostels";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/owner/login" element={<OwnerLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/owner/register" element={<OwnerRegister />} />

        {/* Owner Protected Routes */}
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute role="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

          <Route
            path="/owner/hostel"
             element={
              <ProtectedRoute role="owner">
                <HostelManagement />
                  </ProtectedRoute>
                   }
                    />
        <Route
          path="/owner/rooms"
          element={
            <ProtectedRoute role="owner">
              <RoomManagement />
            </ProtectedRoute>
          }
        />
        <Route
  path="/owner/residents"
  element={
    <ProtectedRoute role="owner">
      <ResidentManagement />
    </ProtectedRoute>
  }
/>
                <Route
  path="/owner/billing"
  element={
    <ProtectedRoute role="owner">
      <BillingManagement />
    </ProtectedRoute>
  }
/>
        {/* Admin Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/owners"
          element={
          <ProtectedRoute role="admin">
          <OwnerApproval />
          </ProtectedRoute>
           }
          />

      <Route
  path="/admin/hostels"
  element={
    <ProtectedRoute role="admin">
      <AdminHostels />
    </ProtectedRoute>
  }
/>
      </Routes>
    </Router>
  );
}

export default App;
