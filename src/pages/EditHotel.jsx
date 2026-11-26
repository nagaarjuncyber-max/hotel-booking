import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Swal from 'sweetalert2';
import { fetchHotelById, updateHotel, clearCurrent } from '../features/hotels/hotelSlice';
import HotelForm from '../components/HotelForm';
import { toFieldErrors } from '../utils/errors';

export default function EditHotel() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, loading, error } = useSelector((s) => s.hotels);
  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  useEffect(() => {
    dispatch(fetchHotelById(id));
    return () => { dispatch(clearCurrent()); };
  }, [dispatch, id]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setServerErrors({});
    try {
      await dispatch(updateHotel({ id, formData })).unwrap();
      await Swal.fire({ title: 'Updated!', text: 'Hotel updated successfully.', icon: 'success', timer: 1500, showConfirmButton: false });
      navigate('/');
    } catch (e) {
      setServerErrors(toFieldErrors(e));
      if (!e?.errors) Swal.fire('Error', e?.message || 'Could not update hotel', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !current) return <p className="state">Loading...</p>;
  if (error && !current) return <p className="state err">{error}</p>;
  if (!current) return null;

  return (
    <section className="narrow">
      <Helmet>
        <title>{`Edit ${current.title} | Hotel Booking`}</title>
        <meta name="description" content={`Edit details of ${current.title}`} />
      </Helmet>
      <h1>Edit Hotel</h1>
      <HotelForm
        initialData={current}
        onSubmit={handleSubmit}
        submitting={submitting}
        serverErrors={serverErrors}
        submitLabel="Update Hotel"
      />
    </section>
  );
}