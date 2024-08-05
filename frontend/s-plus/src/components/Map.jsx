import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { OpenCageProvider } from "leaflet-geosearch";
import "../styles/map.css";

// Import the images manually
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Create a custom icon
const customIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function LocationMarker({ onLocationSelected, mapIsActive }) {
  const [markerPosition, setMarkerPosition] = useState(null);

  useMapEvents({
    click(e) {
      if (mapIsActive) {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        if (onLocationSelected) {
          onLocationSelected({ lat, lng });
        }
      }
    },
  });

  return markerPosition === null ? null : (
    <Marker position={markerPosition} icon={customIcon}>
      <Popup>
        Latitude: {markerPosition[0]} <br />
        Longitude: {markerPosition[1]}
      </Popup>
    </Marker>
  );
}

function SearchControl({ onSearchResult, setMapIsActive }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const map = useMap(); // Access the map instance

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery) return; // Early exit if searchQuery is empty

    const provider = new OpenCageProvider({
      params: {
        key: "df26c889f5da40f8816b986c9acf6942", // Replace with your OpenCage API key
        q: searchQuery,
      },
    });

    try {
      const results = await provider.search({ query: searchQuery });
      setSearchResults(results);
      console.log(results);
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  const handleResultClick = (result, e) => {
    e.stopPropagation(); // Prevent event from propagating to the map
    console.log("Clicked result:", result);

    const { x: lng, y: lat } = result;

    if (lat !== undefined && lng !== undefined) {
      map.flyTo([lat, lng], 13, { animate: true });

      map.once("moveend", () => {
        if (onSearchResult) {
          onSearchResult({ lat, lng });
          setMapIsActive(true); // Re-enable map interactions
        }
      });
    } else {
      console.error("Invalid location data: lat or lng is undefined.");
    }

    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div
      className="search-control"
      onMouseEnter={() => setMapIsActive(false)}
      onMouseLeave={() => setMapIsActive(true)}
      onClick={(e) => e.stopPropagation()} // Prevent click propagation to map
    >
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a location"
          className="search-input"
          onClick={(e) => e.stopPropagation()} // Prevent click propagation to map
        />
      </form>
      <ul className="search-results">
        {searchResults.map((result, index) => (
          <li
            key={index}
            onClick={(e) => handleResultClick(result, e)}
            className="result-option"
          >
            {result.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Map({ onLocationSelected }) {
  const [mapIsActive, setMapIsActive] = useState(true);

  return (
    <div className="map-container">
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "500px", width: "600px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker
          onLocationSelected={onLocationSelected}
          mapIsActive={mapIsActive}
        />
        <div className="search-wrapper">
          <SearchControl
            setMapIsActive={setMapIsActive}
            onSearchResult={({ lat, lng }) => {
              onLocationSelected({ lat, lng });
            }}
          />
        </div>
      </MapContainer>
    </div>
  );
}

export default Map;
