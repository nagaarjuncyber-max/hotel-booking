import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchHotelById, clearCurrent } from '../features/hotels/hotelSlice';
import { API_URL } from '../api/axios';
import HotelMap from '../components/HotelMap';

export default function HotelDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: hotel, loading, error } = useSelector((s) => s.hotels);

  useEffect(() => {
    dispatch(fetchHotelById(id));
    return () => { dispatch(clearCurrent()); };
  }, [dispatch, id]);

  if (loading && !hotel) return <p className="state">Loading...</p>;
  if (error && !hotel) return <p className="state err">{error}</p>;
  if (!hotel) return null;

  const imageUrl = hotel.image_path ? `${API_URL}${hotel.image_path}` : '';

  return (
    <section>
      <Helmet>
        <title>{`${hotel.title} | Hotel Booking`}</title>
        <meta name="description" content={hotel.description.slice(0, 150)} />
        <meta property="og:title" content={hotel.title} />
        <meta property="og:description" content={hotel.description.slice(0, 150)} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
      </Helmet>

      <Link to="/" className="back">← Back to hotels</Link>

      <div className="detail">
        <img className="detail-img" src={imageUrl} alt={hotel.title} />
        <div className="card detail-info">
          <h1>{hotel.title}</h1>
          <p className="price big">₹{Number(hotel.price).toLocaleString('en-IN')}</p>
          <p>{hotel.description}</p>
          <p className="muted">
            Location: {hotel.latitude}, {hotel.longitude}
          </p>
          <Link className="btn btn-outline" to={`/edit/${hotel.id}`}>Edit Hotel</Link>
        </div>
      </div>

      <h2>Location</h2>
      <HotelMap latitude={hotel.latitude} longitude={hotel.longitude} title={hotel.title} />
    </section>
  );
}