import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const distanceKm = ([lat1, lon1], [lat2, lon2]) => {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export default function HotelMap({ latitude, longitude, title }) {
  const position = [Number(latitude), Number(longitude)];
  const [me, setMe] = useState(null);
  const [geoError, setGeoError] = useState('');

  const locateMe = () => {
    setGeoError('');
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setMe([pos.coords.latitude, pos.coords.longitude]),
      () => setGeoError('Location permission denied or unavailable')
    );
  };

  return (
    <div>
      <MapContainer center={position} zoom={13} scrollWheelZoom={false} className="map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>{title}</Popup>
        </Marker>
        {me && (
          <>
            <Marker position={me}><Popup>You are here</Popup></Marker>
            <Polyline positions={[me, position]} />
          </>
        )}
      </MapContainer>

      <div className="map-actions">
        <button className="btn btn-outline" onClick={locateMe}>📍 Show distance from my location</button>
        {me && <span>Distance: <strong>{distanceKm(me, position).toFixed(1)} km</strong></span>}
        {geoError && <span className="err">{geoError}</span>}
      </div>
    </div>
  );
}