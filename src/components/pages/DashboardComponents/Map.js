// https://www.npmjs.com/package/@react-google-maps/api - @react-google-maps/api Package
// https://react-google-maps-api-docs.netlify.app/ - @react-google-maps/api Offcial docs

import React, { useState } from 'react';
import {
  GoogleMap,
  Marker,
  useLoadScript,
  InfoWindow,
} from '@react-google-maps/api';
import ReactPlayer from 'react-player';
import mapStyles from '../../../styles/map-styles';

const libraries = ['places'];

// Default Map size
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

// Default Map center position
const center = {
  lat: 34.052235,
  lng: -118.243683,
};

const icons = {
  Hubs: { icon: 'https://img.icons8.com/color/40/000000/hub.png' },
  Supplier: { icon: 'https://img.icons8.com/fluent/40/000000/supplier.png' },
  Manufacturer: {
    icon: 'https://img.icons8.com/ultraviolet/40/000000/factory.png',
  },
};

// Temp database
const markers = [
  {
    id: 1,
    lat: 34.052235,
    lng: -118.243683,
    type: 'Hubs',
    placeName: 'EcoSoap Hub',
    photoURL:
      'https://www.ywcalgary.ca/wp-content/uploads/2017/09/YW-Community-Engagement.png',
    videoURL: 'https://youtu.be/3Pnk-EDn7SA',
  },
  {
    id: 2,
    lat: 33.812092,
    lng: -117.918976,
    type: 'Supplier',
    placeName: 'EcoSoap Supplier',
    photoURL:
      'https://bioprocessintl.com/wp-content/uploads/2018/04/RavensburgVetterWest.jpg',
    videoURL: 'https://youtu.be/3Pnk-EDn7SA',
  },
  {
    id: 3,
    lat: 34.097131,
    lng: -117.713157,
    type: 'Manufacturer',
    placeName: 'EcoSoap Manufacturer',
    photoURL:
      'https://qtxasset.com/styles/breakpoint_sm_default_480px_w/s3/fiercepharma/1526570701/main%20picture_samsung%20biologics.jpg?0hkHxQbY5vG84M_WYoyfJ2RoDd0TEGtS&itok=nnp-VEYI',
    videoURL: 'https://youtu.be/3Pnk-EDn7SA',
  },
];

// Optional Map settings
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

const Map = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    libraries,
  });

  const [selectedMarker, setSelectedMarker] = useState(null);

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';

  return (
    <div className="mapContainer">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={center}
        options={options}
      >
        {markers.map(marker => (
          <Marker
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={icons[marker.type].icon}
            onClick={() => {
              setSelectedMarker(marker);
            }}
          />
        ))}
        ;
        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => {
              setSelectedMarker(null);
            }}
          >
            <div>
              <h3>{selectedMarker.placeName}</h3>
              <img src={selectedMarker.photoURL} alt="Location_photoURL" />
              <ReactPlayer url={selectedMarker.videoURL} />
            </div>
          </InfoWindow>
        )}
        ;
      </GoogleMap>
    </div>
  );
};

export default Map;
