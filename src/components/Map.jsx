import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { setLocation } from "../slices/location/locationSlice"; // Assuming you have a location slice
import { useDispatch } from "react-redux";

// Fix Leaflet marker icons (default icons issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const Map = () => {
  const [location, setLocationState] = useState({
    latitude: null,
    longitude: null,
    address: null,
    city: null,
    state: null,
    country: null,
    postalCode: null,
  });
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  const dispatch = useDispatch();

  console.log(location);

  // Fetch address from latitude and longitude
  const fetchAddress = async (lat, lng) => {
    try {
      const API_URL = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
      const response = await fetch(API_URL);
      const data = await response.json();

      // Update the location state with fetched details
      setLocationState((prev) => ({
        ...prev,
        address: data.display_name,
        city: data.address.city || data.address.town || data.address.village,
        state: data.address.state,
        country: data.address.country,
        postalCode: data.address.postcode,
      }));

      // Now dispatch the updated location state to Redux after the state is updated
      dispatch(setLocation({
        latitude: lat,
        longitude: lng,
        address: data.display_name,
        city: data.address.city || data.address.town || data.address.village,
        state: data.address.state,
        country: data.address.country,
        postalCode: data.address.postcode,
      }));

    } catch (err) {
      setError("Failed to fetch address details.");
    }
  };

  // Get user's location using Geolocation API
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Update location state with latitude and longitude
          setLocationState((prev) => ({
            ...prev,
            latitude,
            longitude,
          }));

          // Fetch the address details after location update
          fetchAddress(latitude, longitude);
        },
        () => {
          setError("Unable to retrieve your location.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  // Hide the map after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 7000);

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, []);

  // Return early if map is not visible
  if (!isVisible) return null;

  return (
    <div className="bg-indigo-100 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-4 text-indigo-900">Your Location | Magazina</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : location.latitude && location.longitude ? (
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
          className="rounded-lg"
        >
          {/* Map Tile */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Marker */}
          <Marker position={[location.latitude, location.longitude]}>
            <Popup>
              You are here: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p className="text-gray-500">Fetching your location...</p>
      )}
    </div>
  );
};

export default Map;
