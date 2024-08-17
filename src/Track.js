import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-control-geocoder";
import { FaMapMarkerAlt } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";
import ModalComponent from "./ModalComponent";
import './App.css'; // Ensure this file is imported
import { MDBAccordion, MDBAccordionItem, MDBBadge, MDBIcon, MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";

const mapContainerStyle = {
  width: "100%",
  height: "80vh",
  
};

const RoutingMachine = ({ start, end }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map || !start || !end) return;

    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    routingControlRef.current = L.Routing.control({
      waypoints: [L.latLng(start.lat, start.lng), L.latLng(end.lat, end.lng)],
      routeWhileDragging: true,
      geocoder: L.Control.Geocoder.nominatim(),
      lineOptions: {
        styles: [{ color: "blue", weight: 4 }],
      },
    }).addTo(map);

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [map, start, end]);

  return null;
};

const CustomMarker = ({ position, icon, onClick }) => (
  <Marker position={position} icon={icon} eventHandlers={{ click: onClick }}>
    <Popup>{`Lat: ${position.lat}, Lng: ${position.lng}`}</Popup>
  </Marker>
);

function App() {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [destinationInput, setDestinationInput] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [destinationHistory, setDestinationHistory] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setStart({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error fetching current location:", error);
        setStart({ lat: 51.505, lng: -0.09 });
      }
    );
  }, []);

  const geocode = (address, setLocation) => {
    const geocoder = L.Control.Geocoder.nominatim();
    geocoder.geocode(address, (results) => {
      if (results && results.length > 0) {
        const { center } = results[0];
        setLocation({ lat: center.lat, lng: center.lng });
      } else {
        alert("Location not found");
      }
    });
  };

  const handleCalculateRoute = () => {
    if (destinationInput) {
      geocode(destinationInput, (location) => {
        setEnd(location);
        setDestinationHistory((prevHistory) => [
          ...prevHistory,
          {
            lat: location.lat,
            lng: location.lng,
            name: destinationInput,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            history: "Previous travel history data would be displayed here." // Replace with actual history
          },
        ]);
      });
    }
  };

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const startIcon = L.divIcon({
    className: "custom-icon",
    html: `<div style="border-radius: 50%; padding: 10px; color: white; font-size: 20px;">${ReactDOMServer.renderToStaticMarkup(      <MDBIcon fas icon="car-side" style={{ color: "blue" }}/>
    )}</div>`,
  });

  const endIcon = L.divIcon({
    className: "custom-icon",
    html: `<div style="border-radius: 50%; padding: 10px; color: white; font-size: 20px;">${ReactDOMServer.renderToStaticMarkup(<FaMapMarkerAlt style={{ color: 'red' }} />)}</div>`,
  });

  return (
    <div >
      <div style={{ padding: "10px" , height:'7vh'}}>
        <input
          type="text"
          value={destinationInput}
          placeholder="Enter destination"
          onChange={(e) => setDestinationInput(e.target.value)}
          style={{ marginRight: "10px", padding: "5px", width: "200px" , height:'5vh', borderRadius:'5px', }}
        />
        <button
          onClick={handleCalculateRoute}
          style={{
            padding: "6px 12px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
         <MDBIcon fas icon="search-location" />
        </button>
      </div>

      {start && (
        <MapContainer
          style={mapContainerStyle}
          center={[start.lat, start.lng]}
          zoom={13}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {start && <CustomMarker position={start} icon={startIcon} onClick={() => handleMarkerClick({ ...start, name: "Current Location", date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString(), history: "Current location history" })} />}
          {end && <CustomMarker position={end} icon={endIcon} onClick={() => handleMarkerClick({ ...end, name: "Destination", date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString(), history: "Destination location history" })} />}
          {start && end && <RoutingMachine start={start} end={end} />}
        </MapContainer>
      )}

      <ModalComponent
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        location={selectedLocation}
      />

      <div style={{ marginTop: "20px", padding: "10px" }}>
       
        <MDBAccordion initialActive={1}>
        <MDBAccordionItem collapseId={1} headerTitle='Previous destinations'>
        <MDBListGroup light numbered style={{ minWidth: '22rem' }}>
        <ul>
          {destinationHistory.map((location, index) => (
            <li key={index} onClick={() => handleMarkerClick(location)} style={{ cursor: "pointer" }}>
              {/* */}
            
            <MDBListGroupItem className='d-flex justify-content-between align-items-start'>
            <div className='ms-2 me-auto'>
              <div className='fw-bold'><strong>Location:</strong> {location.name || "Unknown"} </div><strong>Lat:</strong> {location.lat}, <strong>Lng:</strong> {location.lng}
            </div>
            <MDBBadge pill light>
              {location.time} , {location.date}
            </MDBBadge>
          </MDBListGroupItem></li>
          ))}
        </ul>
        </MDBListGroup>
        </MDBAccordionItem>
        </MDBAccordion>
      </div>
    </div>
  );
}

export default App;
