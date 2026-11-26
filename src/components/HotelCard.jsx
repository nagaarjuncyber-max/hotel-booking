import { useNavigate } from 'react-router-dom';
import { API_URL } from '../api/axios';

export default function HotelCard({ hotel, onDelete }) {
  const navigate = useNavigate();
  const snippet =
    hotel.description.length > 90 ? hotel.description.slice(0, 90) + '…' : hotel.description;

  return (
    <article className="card hotel-card" onClick={() => navigate(`/hotels/${hotel.id}`)}>
      <img
        src={hotel.image_path ? `${API_URL}${hotel.image_path}` : 'https://placehold.co/400x250?text=No+Image'}
        alt={hotel.title}
        loading="lazy"
      />
      <div className="card-body">
        <h3>{hotel.title}</h3>
        <p className="price">₹{Number(hotel.price).toLocaleString('en-IN')}</p>
        <p className="muted">{snippet}</p>
        <div className="actions">
          <button
            className="btn btn-outline"
            onClick={(e) => { e.stopPropagation(); navigate(`/edit/${hotel.id}`); }}
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={(e) => { e.stopPropagation(); onDelete(hotel); }}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}