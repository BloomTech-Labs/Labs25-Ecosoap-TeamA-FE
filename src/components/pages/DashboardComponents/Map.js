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

// Optional Map settings
const options = {
  styles: mapStyles,
  disableDefaultUI: false,
  streetViewControl: true,
  streetViewControlOptions: {
    disableDefaultUI: true,
  },
  zoomControl: true,
  gestureHandling: 'greedy',
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
          icon
        }
        coordinates {
          latitude
          longitude
        }
        fields {
          name
          value
        }
        media
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
        <label htmlFor="all">All</label>
        <br />
        <input
          type="radio"
          id="Eco-Soap Bank Hubs"
          name="type"
          value="Eco-Soap Bank Hubs"
          onChange={handleChange}
        />
        <label htmlFor="Eco-Soap Bank Hubs">Eco-Soap Bank Hubs</label>
        <br />
        <input
          type="radio"
          id="Distribution Partners"
          name="type"
          value="Distribution Partners"
          onChange={handleChange}
        />
        <label htmlFor="Distribution Partners">Distribution Partners</label>
        <br />
        <input
          type="radio"
          id="Distributions"
          name="type"
          value="Distributions"
          onChange={handleChange}
        />
        <label htmlFor="Distributions">Distributions</label>
        <br />
        <input
          type="radio"
          id="Hotel Partners"
          name="type"
          value="Hotel Partners"
          onChange={handleChange}
        />
        <label htmlFor="Hotel Partners">Hotel Partners</label>
        <br />
        <input
          type="radio"
          id="Manufacturing Partners"
          name="type"
          value="Manufacturing Partners"
          onChange={handleChange}
        />
        <label htmlFor="Manufacturing Partners">Manufacturing Partners</label>
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
            .map(marker => {
              return (
                <Marker
                  key={marker.id}
                  position={{
                    lat: marker.coordinates.latitude,
                    lng: marker.coordinates.longitude,
                  }}
                  icon={marker.type.icon}
                  onClick={() => {
                    setSelectedMarker(marker);
                  }}
                />
              );
            })}
        {selectedAll &&
          markers.map(marker => (
            <Marker
              key={marker.id}
              position={{
                lat: marker.coordinates.latitude,
                lng: marker.coordinates.longitude,
              }}
              icon={marker.type.icon}
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

                {selectedMarker.fields[0].name === 'Website' && (
                  <h3>
                    {selectedMarker.fields[0].name}{' '}
                    <a href={selectedMarker.fields[0].value} target="blank">
                      {selectedMarker.fields[0].value}
                    </a>{' '}
                  </h3>
                )}
                {selectedMarker.fields[0].name !== 'Website' && (
                  <h3>
                    {selectedMarker.fields[0].name}{' '}
                    {selectedMarker.fields[0].value}
                  </h3>
                )}

                {selectedMarker.media.map((medias, idx) => {
                  return (
                    <div key={idx}>
                      <img src={medias} alt="media" />
                    </div>
                  );
                })}
                {/* <ReactPlayer url={selectedMarker.videoURL} /> */}
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
