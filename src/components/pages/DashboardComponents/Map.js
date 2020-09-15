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
import mapStyles from '../../../styles/map-styles';
import ReactPlayer from 'react-player';

// Geocode API Key
const geocodekey = process.env.REACT_APP_GEO_CODE_KEY;

// Default Map size
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

// Default Map center position
const center = {
  lat: 8.454354,
  lng: -13.22888,
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

const libraries = ['places'];

const Map = () => {
  //GraphQL Query
  const data = gql`
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

  const types = gql`
    {
      types {
        id
        name
      }
    }
  `;

  // States
  const [markers, setMarkers] = useState([]); // Markers
  const [ecoTypes, setEcoTypes] = useState([]); // Types
  const [selectedMarker, setSelectedMarker] = useState(null); // Selected Marker for Info Window
  const [selectedType, setSelectedType] = useState(''); // Radio Filter - Display based on type
  const [selectedAll, setSelectedAll] = useState(true); // Radio Filter - Display all types

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    libraries,
  });

  // Data retrieval
  useEffect(() => {
    client
      .query({ query: data })
      .then(res => {
        setMarkers(res.data.records);
      })
      .catch(err => console.log('ERROR', err));
    client
      .query({ query: types })
      .then(res => {
        setEcoTypes(res.data.types);
      })
      .catch(err => console.log('ERROR', err));
  }, []);

  // Load Map
  const mapRef = React.useRef();
  const onMapLoad = React.useCallback(map => {
    mapRef.current = map;
  }, []);

  // Pan & Zoom
  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

  // Handle Display Filter
  const handleChange = event => {
    if (event.target.value === 'all') {
      setSelectedAll(true);
    } else {
      setSelectedType(event.target.value);
      setSelectedAll(false);
    }
  };

  // Condition checking on Google Map
  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';

  return (
    <div className="mapContainer">
      {/*--------------------- Map Filter Start --------------------*/}
      <div className="typeFilter">
        <div>
          <p>Please select type:</p>
          <input
            type="radio"
            id="all"
            name="type"
            value="all"
            onChange={handleChange}
          />
          <label htmlFor="all"> All</label>
        </div>
        {ecoTypes.map(types => {
          return (
            <div>
              <input
                type="radio"
                id={types.id}
                name="type"
                value={types.name}
                onChange={handleChange}
              />
              <label htmlFor="type"> {types.name}</label>
            </div>
          );
        })}
      </div>
      {/*--------------------- Map Filter End --------------------*/}

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
                icon={marker.type.icon}
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
              {selectedMarker && (
                <div>
                  <h2>{selectedMarker.name}</h2>
                  <h3>{selectedMarker.type.name}</h3>

                  {selectedMarker.fields.length >= 1 &&
                    selectedMarker.fields[0].name === 'Website' && (
                      <h3>
                        {selectedMarker.fields[0].name}
                        {': '}
                        <a href={selectedMarker.fields[0].value} target="blank">
                          {selectedMarker.fields[0].value}
                        </a>
                      </h3>
                    )}
                  {selectedMarker.fields.length >= 1 &&
                    selectedMarker.fields[0].name !== 'Website' && (
                      <h3>
                        {selectedMarker.fields[0].name}
                        {': '}
                        {selectedMarker.fields[0].value}
                      </h3>
                    )}

                  {Object.values(selectedMarker.media).length >= 1 &&
                    Object.values(selectedMarker.media) != 'null' &&
                    selectedMarker.media.map((medias, idx) => {
                      return (
                        <div key={idx}>
                          <img src={medias} alt="media" />
                        </div>
                      );
                    })}
                  {/* <ReactPlayer url={selectedMarker.videoURL} /> */}
                </div>
              )}
            </InfoWindow>
          </div>
        )}
      </GoogleMap>
    </div>
  );
};

// <Locate Me> Functionality
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
      {/*------ Locate Me Button ------*/}
      <img
        src="https://e7.pngegg.com/pngimages/760/399/png-clipart-map-computer-icons-flat-design-location-logo-location-icon-photography-heart.png"
        alt="locate ME"
      />
    </button>
  );
}

// <Search Address Bar> Functionality
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
            const { lat, lng } = results.data.results[0].locations[0].latLng;
            panTo({ lat, lng });
          } catch (err) {
            console.log('ERROR', err);
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
