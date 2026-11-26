import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import HotelList from './pages/HotelList';
import AddHotel from './pages/AddHotel';
import EditHotel from './pages/EditHotel';
import HotelDetail from './pages/HotelDetail';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HotelList />} />
          <Route path="/add" element={<AddHotel />} />
          <Route path="/edit/:id" element={<EditHotel />} />
          <Route path="/hotels/:id" element={<HotelDetail />} />
          <Route path="*" element={<p className="state">Page not found. <Link to="/">Go home</Link></p>} />
        </Routes>
      </main>
    </>
  );
}