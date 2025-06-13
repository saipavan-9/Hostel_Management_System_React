import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Layout({ children, role }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const links = {
    owner: [
      { to: "/owner/dashboard", label: "Dashboard" },
      { to: "/owner/hostel", label: "Hostel" },         // ✅ Added this
      { to: "/owner/rooms", label: "Rooms" },
      { to: "/owner/residents", label: "Residents" },
      { to: "/owner/billing", label: "Billing" },
    ],
    admin: [
      { to: "/admin/dashboard", label: "Dashboard" },
      { to: "/admin/owners", label: "Approve Owners" },
      { to: "/admin/hostels", label: "All Hostels" }

    ],
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <aside style={{ width: "220px", background: "#2d2d2d", color: "white", padding: "20px" }}>
        <h3>{role.charAt(0).toUpperCase() + role.slice(1)} Panel</h3>
        <nav>
          {links[role].map((item) => (
            <div key={item.to} style={{ margin: "10px 0" }}>
              <Link to={item.to} style={{ color: "#fff", textDecoration: "none" }}>{item.label}</Link>
            </div>
          ))}
          <hr />
          <button onClick={() => { logout(); navigate("/"); }} style={{ marginTop: "20px" }}>
            Logout
          </button>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: "20px", background: "#f2f2f2" }}>
        {children}
      </main>
    </div>
  );
}
