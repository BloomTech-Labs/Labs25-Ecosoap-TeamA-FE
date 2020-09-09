// https://www.npmjs.com/package/@react-google-maps/api - @react-google-maps/api Package
// https://react-google-maps-api-docs.netlify.app/ - @react-google-maps/api Offcial docs

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import gql from 'graphql-tag';
import { client } from '../../../index.js';

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
  width: '100%',
  height: '100%',
};

// Default Map center position
const center = {
  lat: 51.511327,
  lng: -0.10439,
};

const icons = {};

// const icons = {
//   "Eco-Soap Bank Hubs": { icon: 'https://img.icons8.com/color/40/000000/hub.png' },
//   "Hotel Partners": { icon: 'https://img.icons8.com/fluent/40/000000/supplier.png' },
//   "Manufacturing Partners": { icon: 'https://img.icons8.com/ultraviolet/40/000000/factory.png'},
//   "Distribution Partners": { icon: 'https://img.icons8.com/ultraviolet/40/000000/factory.png'},
// };

// Temp database
// const markers = [
//   {
//     id: 1,
//     lat: 34.052235,
//     lng: -118.243683,
//     type: 'Hubs',
//     placeName: 'EcoSoap Hub',
//     photoURL:
//       'https://www.ywcalgary.ca/wp-content/uploads/2017/09/YW-Community-Engagement.png',
//     videoURL: 'https://youtu.be/3Pnk-EDn7SA',
//   },
//   {
//     id: 2,
//     lat: 33.812092,
//     lng: -117.918976,
//     type: 'Supplier',
//     placeName: 'EcoSoap Supplier',
//     photoURL:
//       'https://bioprocessintl.com/wp-content/uploads/2018/04/RavensburgVetterWest.jpg',
//     videoURL: 'https://youtu.be/3Pnk-EDn7SA',
//   },
//   {
//     id: 3,
//     lat: 34.097131,
//     lng: -117.713157,
//     type: 'Manufacturer',
//     placeName: 'EcoSoap Manufacturer',
//     photoURL:
//       'https://qtxasset.com/styles/breakpoint_sm_default_480px_w/s3/fiercepharma/1526570701/main%20picture_samsung%20biologics.jpg?0hkHxQbY5vG84M_WYoyfJ2RoDd0TEGtS&itok=nnp-VEYI',
//     videoURL: 'https://youtu.be/3Pnk-EDn7SA',
//   },
// ];

// Optional Map settings
const options = {
  styles: mapStyles,
  disableDefaultUI: false,
  streetViewControl: true,
  streetViewControlOptions: {
    disableDefaultUI: true,
  },
  zoomControl: true,
};

const Map = () => {
  let data = gql`
    {
      records {
        id
        name
        type {
          id
          name
        }
        coordinates {
          latitude
          longitude
        }
        fields {
          name
          value
        }
      }
    }
  `;

  useEffect(() => {
    client
      .query({ query: data })
      .then(res => {
        console.log('RECORDS RESPONSE', res);
        setMarkers(res.data.records);
      })
      .catch(err => console.log('ERROR', err));
  }, []);

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
    mapRef.current.setZoom(14);
  }, []);

  const [markers, setMarkers] = useState([]);
  console.log('MARKER!', markers);

  const [selectedMarker, setSelectedMarker] = useState(null);

  const [selectedType, setSelectedType] = useState('');
  const [selectedAll, setSelectedAll] = useState(true);

  const handleChange = event => {
    if (event.target.value === 'all') {
      setSelectedAll(true);
      console.log(selectedType, selectedAll);
    } else {
      setSelectedType(event.target.value);
      setSelectedAll(false);
      console.log(selectedType, selectedAll);
    }
  };

  // const handleDirection = (lat, lng) =>{
  //   console.log(lat, lng)

  // }

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';

  return (
    <div className="mapContainer">
      <form>
        <p>Please select type:</p>
        <input
          type="radio"
          id="all"
          name="type"
          value="all"
          onChange={handleChange}
        />
        <label for="all">All</label>
        <br />
        <input
          type="radio"
          id="Eco-Soap Bank Hubs"
          name="type"
          value="Eco-Soap Bank Hubs"
          onChange={handleChange}
        />
        <label for="Eco-Soap Bank Hubs">Eco-Soap Bank Hubs</label>
        <br />
        <input
          type="radio"
          id="Distribution Partners"
          name="type"
          value="Distribution Partners"
          onChange={handleChange}
        />
        <label for="Distribution Partners">Distribution Partners</label>
        <br />
        <input
          type="radio"
          id="Distributions"
          name="type"
          value="Distributions"
          onChange={handleChange}
        />
        <label for="Distributions">Distributions</label>
        <br />
        <input
          type="radio"
          id="Hotel Partners"
          name="type"
          value="Hotel Partners"
          onChange={handleChange}
        />
        <label for="Hotel Partners">Hotel Partners</label>
        <br />
        <input
          type="radio"
          id="Manufacturing Partners"
          name="type"
          value="Manufacturing Partners"
          onChange={handleChange}
        />
        <label for="Manufacturing Partners">Manufacturing Partners</label>
      </form>

      <Search panTo={panTo} />
      <Locate panTo={panTo} />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={3}
        center={center}
        options={options}
        onLoad={onMapLoad}
      >
        {!selectedAll &&
          markers
            .filter(marker => marker.type.name === selectedType)
            .map(marker => (
              <Marker
                key={marker.id}
                position={{
                  lat: marker.coordinates.latitude,
                  lng: marker.coordinates.longitude,
                }}
                // icon={icons[marker.type].icon}
                icon={'https://img.icons8.com/color/40/000000/hub.png'}
                onClick={() => {
                  setSelectedMarker(marker);
                }}
              />
            ))}
        {selectedAll &&
          markers.map(marker => (
            <Marker
              key={marker.id}
              position={{
                lat: marker.coordinates.latitude,
                lng: marker.coordinates.longitude,
              }}
              icon={'https://img.icons8.com/color/40/000000/hub.png'}
              onClick={() => {
                setSelectedMarker(marker);
              }}
            />
          ))}
        ;
        {selectedMarker && (
          <div>
            <InfoWindow
              position={{
                lat: selectedMarker.coordinates.latitude,
                lng: selectedMarker.coordinates.longitude,
              }}
              onCloseClick={() => {
                setSelectedMarker(null);
              }}
            >
              <div>
                <h2>{selectedMarker.name}</h2>
                <h3>{selectedMarker.type.name}</h3>
                <h3>
                  {selectedMarker.fields[0].name}{' '}
                  <a href={selectedMarker.fields[0].value} target="blank">
                    {selectedMarker.fields[0].value}
                  </a>{' '}
                </h3>
                {/* <img src={selectedMarker.photoURL} alt="Location_photoURL" />
                <ReactPlayer url={selectedMarker.videoURL} /> */}
              </div>
            </InfoWindow>
          </div>
        )}
      </GoogleMap>
    </div>
  );
};

function Locate({ panTo }) {
  return (
    <button
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          position => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null,
          options
        );
      }}
    >
      <img
        src="https://e7.pngegg.com/pngimages/760/399/png-clipart-map-computer-icons-flat-design-location-logo-location-icon-photography-heart.png"
        alt="locate ME"
      />
    </button>
  );
}

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
