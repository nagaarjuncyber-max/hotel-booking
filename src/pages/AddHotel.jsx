import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Swal from 'sweetalert2';
import { addHotel } from '../features/hotels/hotelSlice';
import HotelForm from '../components/HotelForm';
import { toFieldErrors } from '../utils/errors';

export default function AddHotel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setServerErrors({});
    try {
      await dispatch(addHotel(formData)).unwrap();
      await Swal.fire({ title: 'Added!', text: 'Hotel added successfully.', icon: 'success', timer: 1500, showConfirmButton: false });
      navigate('/');
    } catch (e) {
      setServerErrors(toFieldErrors(e));
      if (!e?.errors) Swal.fire('Error', e?.message || 'Could not add hotel', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="narrow">
      <Helmet>
        <title>Add Hotel | Hotel Booking</title>
        <meta name="description" content="Add a new hotel with image, price and location." />
      </Helmet>
      <h1>Add Hotel</h1>
      <HotelForm onSubmit={handleSubmit} submitting={submitting} serverErrors={serverErrors} submitLabel="Add Hotel" />
    </section>
  );
}