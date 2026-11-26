import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import Swal from 'sweetalert2';
import { fetchHotels, deleteHotel } from '../features/hotels/hotelSlice';
import HotelCard from '../components/HotelCard';
import Pagination from '../components/Pagination';
import SearchFilter from '../components/SearchFilter';

const LIMIT = 6;

export default function HotelList() {
  const dispatch = useDispatch();
  const { items, total, loading, error } = useSelector((s) => s.hotels);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ search: '', minPrice: '', maxPrice: '' });

  const totalPages = Math.ceil(total / LIMIT);

  const load = useCallback(() => {
    dispatch(fetchHotels({ ...filters, limit: LIMIT, offset: (page - 1) * LIMIT }));
  }, [dispatch, filters, page]);

  useEffect(() => { load(); }, [load]);

  const applyFilters = (f) => { setFilters(f); setPage(1); };

  const handleDelete = async (hotel) => {
    const res = await Swal.fire({
      title: 'Delete this hotel?',
      text: hotel.title,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#dc2626',
    });
    if (!res.isConfirmed) return;

    try {
      await dispatch(deleteHotel(hotel.id)).unwrap();
      await Swal.fire({
        title: 'Deleted!',
        text: 'Hotel deleted successfully.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false,
      });
      if (items.length === 1 && page > 1) setPage(page - 1);
      else load();
    } catch (e) {
      Swal.fire('Error', e?.message || 'Delete failed', 'error');
    }
  };

  return (
    <section>
      <Helmet>
        <title>Hotels | Hotel Booking</title>
        <meta name="description" content="Browse, search and manage hotels with price filters." />
      </Helmet>

      <h1>Hotels</h1>
      <SearchFilter onApply={applyFilters} />

      {loading && <p className="state">Loading...</p>}
      {error && <p className="state err">{error}</p>}
      {!loading && !error && items.length === 0 && <p className="state">No hotels found.</p>}

      <div className="grid">
        {items.map((h) => (
          <HotelCard key={h.id} hotel={h} onDelete={handleDelete} />
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </section>
  );
}