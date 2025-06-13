import "./Landing.css"; // Or separate CSS for Footer if needed

export default function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Hostel Management System. All rights reserved.</p>
    </footer>
  );
}
