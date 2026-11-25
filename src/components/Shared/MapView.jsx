import L from 'leaflet';
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import { placeById } from '../../helpers/cali';
import styles from './MapView.module.scss';

const pin = (emoji, bg) =>
  L.divIcon({
    className: '',
    html: `<div style="background:${bg};width:34px;height:34px;border-radius:50%;display:grid;place-items:center;font-size:18px;border:3px solid #fff;box-shadow:0 2px 6px rgb(0 0 0/.35)">${emoji}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });

// route: ids de lugares (resultado de Dijkstra). courierStep: posición del repartidor.
export default function MapView({ route, courierStep = 0, showCourier = false }) {
  const points = route.map((id) => placeById(id)).filter(Boolean);
  if (!points.length) return null;
  const line = points.map((p) => [p.lat, p.lng]);
  const origin = points[0];
  const dest = points[points.length - 1];
  const courier = points[Math.min(courierStep, points.length - 1)];

  return (
    <MapContainer
      bounds={line}
      boundsOptions={{ padding: [40, 40] }}
      className={styles.map}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={line} pathOptions={{ color: '#D42A6C', weight: 5, dashArray: '8 10' }} />
      <Marker position={[origin.lat, origin.lng]} icon={pin('🍳', '#FFB422')}>
        <Popup>Cocina central · {origin.name}</Popup>
      </Marker>
      <Marker position={[dest.lat, dest.lng]} icon={pin('🏠', '#1E7B5A')}>
        <Popup>Entrega · {dest.name}</Popup>
      </Marker>
      {showCourier && (
        <Marker position={[courier.lat, courier.lng]} icon={pin('🛵', '#D42A6C')} zIndexOffset={500}>
          <Popup>Tu repartidor está en {courier.name}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
