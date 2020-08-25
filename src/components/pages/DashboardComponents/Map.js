// https://www.npmjs.com/package/@react-google-maps/api - @react-google-maps/api Package
// https://react-google-maps-api-docs.netlify.app/ - @react-google-maps/api Offcial docs

import React, { useState } from 'react';
import axios from 'axios';
import {
  GoogleMap,
  Marker,
  useLoadScript,
  InfoWindow,
} from '@react-google-maps/api';
import usePlacesAutocomplete from 'use-places-autocomplete';
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from '@reach/combobox';
import '@reach/combobox/styles.css';

import ReactPlayer from 'react-player';
import mapStyles from '../../../styles/map-styles';

const libraries = ['places'];
const geocodekey = process.env.REACT_APP_GEO_CODE_KEY;

// Default Map size
const mapContainerStyle = {
  width: '60vw',
  height: '75vh',
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

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback(map => {
    mapRef.current = map;
  }, []);
  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(12);
  }, []);

  const [selectedMarker, setSelectedMarker] = useState(null);

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';

  return (
    <div>
      <Search panTo={panTo} />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={center}
        options={options}
        onLoad={onMapLoad}
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

function Search({ panTo }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: {
        lat: () => 34.097131,
        lng: () => -117.713157,
      },
      radius: 200 * 1000,
    },
  });

  return (
    <div className="search">
      <Combobox
        onSelect={async address => {
          setValue(address, false);
          clearSuggestions();
          try {
            const results = await axios.get(
              `https://www.mapquestapi.com/geocoding/v1/address?key=${geocodekey}&inFormat=kvp&outFormat=json&location=${address}&thumbMaps=false`
            );
            // console.log(results.data.results[0].locations[0].latLng)
            const { lat, lng } = results.data.results[0].locations[0].latLng;
            panTo({ lat, lng });
          } catch (error) {
            console.log(error);
          }
        }}
      >
        <ComboboxInput
          value={value}
          onChange={event => {
            setValue(event.target.value);
          }}
          disabled={!ready}
          placeholder="Enter an Address"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === 'OK' &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}

export default Map;
