import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing-container">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>Welcome to HMS</h1>
          <p>
            Manage your hostel effortlessly — track rooms, residents, and rent
            all in one place.
          </p>
        </div>
        <div className="hero-images">
          <img src="/hostel1.jpeg" alt="Hostel View 1" />
          <img src="/hostel2.jpeg" alt="Hostel View 2" />
        </div>
      </section>

      {/* Feature Section */}
      <section className="features">
        <h2>Why Choose HMS?</h2>
        <ul>
          <li>✔️ Easy Owner Registration & Admin Approval</li>
          <li>✔️ Hostel, Room, Resident, and Billing Management</li>
          <li>✔️ Monthly Rent Tracking and Payment History</li>
          <li>✔️ Role-based Secure Dashboard Access</li>
        </ul>
      </section>

      <Footer />
    </div>
  );
}
