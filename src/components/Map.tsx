import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import type { LatLngExpression, Icon } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for pickup and destination
const pickupIcon: Icon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const destinationIcon: Icon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Location {
  lat: number;
  lng: number;
}

interface MapProps {
  pickup: Location | null;
  destination: Location | null;
  onPickupSelect: (location: Location) => void;
  onDestinationSelect: (location: Location) => void;
  selectingType: 'pickup' | 'destination';
}

function MapClickHandler({ onPickupSelect, onDestinationSelect, selectingType }: {
  onPickupSelect: (location: Location) => void;
  onDestinationSelect: (location: Location) => void;
  selectingType: 'pickup' | 'destination';
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      if (selectingType === 'pickup') {
        onPickupSelect({ lat, lng });
      } else {
        onDestinationSelect({ lat, lng });
      }
    },
  });
  return null;
}

const Map = ({ pickup, destination, onPickupSelect, onDestinationSelect, selectingType }: MapProps) => {
  const bengaluruCenter: LatLngExpression = [12.9716, 77.5946];

  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-card">
      <MapContainer
        center={bengaluruCenter}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler 
          onPickupSelect={onPickupSelect}
          onDestinationSelect={onDestinationSelect}
          selectingType={selectingType}
        />
        {pickup && (
          <Marker 
            position={[pickup.lat, pickup.lng] as LatLngExpression} 
            icon={pickupIcon}
          >
            <Popup>Pickup Location</Popup>
          </Marker>
        )}
        {destination && (
          <Marker
            position={[destination.lat, destination.lng] as LatLngExpression} 
            icon={destinationIcon}
          >
            <Popup>Destination</Popup>
          </Marker>
        )}
        {pickup && destination && (
          <Polyline
            positions={[
              [pickup.lat, pickup.lng] as LatLngExpression,
              [destination.lat, destination.lng] as LatLngExpression
            ]}
            pathOptions={{
              color: "#00D4FF",
              weight: 3,
              opacity: 0.8,
              dashArray: "10, 10"
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
