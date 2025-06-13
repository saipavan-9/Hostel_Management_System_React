import { Link } from "react-router-dom";
import "./Landing.css"; // Or separate CSS for Navbar if needed

export default function Navbar() {
  return (
    <header className="navbar">
      <h2 className="logo">🏨 Hostel Management System</h2>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/admin/login">Admin Login</Link>
        <Link to="/owner/login">Owner Login</Link>
        <Link to="/owner/register">Register</Link>
      </nav>
    </header>
  );
}
