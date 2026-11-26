import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <NavLink to="/" className="brand">🏨 Hotel Booking</NavLink>
        <nav>
          <NavLink to="/" end>Hotels</NavLink>
          <NavLink to="/add">Add Hotel</NavLink>
        </nav>
      </div>
    </header>
  );
}