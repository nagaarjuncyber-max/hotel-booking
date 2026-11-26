import { useState, useEffect } from 'react';
import { API_URL } from '../api/axios';

const EMPTY = { title: '', description: '', latitude: '', longitude: '', price: '' };
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export default function HotelForm({ initialData, onSubmit, submitting, serverErrors = {}, submitLabel = 'Save' }) {
  const isEdit = Boolean(initialData);
  const [values, setValues] = useState(EMPTY);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!initialData) return;
    setValues({
      title: initialData.title,
      description: initialData.description,
      latitude: String(initialData.latitude),
      longitude: String(initialData.longitude),
      price: String(initialData.price),
    });
    setPreview(initialData.image_path ? `${API_URL}${initialData.image_path}` : '');
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((er) => ({ ...er, [name]: '' }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!ALLOWED.includes(file.type)) {
      setErrors((er) => ({ ...er, image: 'Only JPG, PNG, WEBP or GIF images are allowed' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((er) => ({ ...er, image: 'Image must be under 5 MB' }));
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setErrors((er) => ({ ...er, image: '' }));
  };

  const validate = () => {
    const e = {};
    if (!values.title.trim()) e.title = 'Title is required';
    else if (values.title.trim().length > 255) e.title = 'Title must be under 255 characters';
    if (!values.description.trim()) e.description = 'Description is required';

    const lat = Number(values.latitude);
    if (values.latitude === '' || Number.isNaN(lat) || lat < -90 || lat > 90)
      e.latitude = 'Latitude must be between -90 and 90';
    const lng = Number(values.longitude);
    if (values.longitude === '' || Number.isNaN(lng) || lng < -180 || lng > 180)
      e.longitude = 'Longitude must be between -180 and 180';
    const price = Number(values.price);
    if (values.price === '' || Number.isNaN(price) || price <= 0)
      e.price = 'Price must be greater than 0';

    if (!isEdit && !image) e.image = 'Image is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.append(k, v.trim()));
    if (image) fd.append('image', image);
    onSubmit(fd);
  };

  const msg = (f) => errors[f] || serverErrors[f];

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="image">Image {isEdit ? '(optional, replace panna mattum)' : '*'}</label>
        <input id="image" type="file" accept="image/*" onChange={handleImage} />
        {msg('image') && <span className="err">{msg('image')}</span>}
        {preview && <img className="preview" src={preview} alt="Hotel preview" />}
      </div>

      <div className="field">
        <label htmlFor="title">Title *</label>
        <input id="title" name="title" value={values.title} onChange={handleChange} placeholder="Hotel name" />
        {msg('title') && <span className="err">{msg('title')}</span>}
      </div>

      <div className="field">
        <label htmlFor="description">Description *</label>
        <textarea id="description" name="description" rows="4" value={values.description} onChange={handleChange} placeholder="About the hotel" />
        {msg('description') && <span className="err">{msg('description')}</span>}
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="latitude">Latitude *</label>
          <input id="latitude" name="latitude" type="number" step="any" value={values.latitude} onChange={handleChange} placeholder="11.0168" />
          {msg('latitude') && <span className="err">{msg('latitude')}</span>}
        </div>
        <div className="field">
          <label htmlFor="longitude">Longitude *</label>
          <input id="longitude" name="longitude" type="number" step="any" value={values.longitude} onChange={handleChange} placeholder="76.9558" />
          {msg('longitude') && <span className="err">{msg('longitude')}</span>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="price">Price (₹) *</label>
        <input id="price" name="price" type="number" step="0.01" min="0" value={values.price} onChange={handleChange} placeholder="4500" />
        {msg('price') && <span className="err">{msg('price')}</span>}
      </div>

      <button className="btn btn-primary" type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}