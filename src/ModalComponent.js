// ModalComponent.js
import React from "react";
import Modal from "react-modal";
import { FaMapMarkerAlt } from "react-icons/fa";
import './App.css';
import { MDBIcon } from "mdb-react-ui-kit";
Modal.setAppElement("#root"); // This is required for accessibility

const ModalComponent = ({ isOpen, onRequestClose, location }) => (
  <Modal 
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Location Details"
    style={{
       
      overlay: {
        zIndex: 1000, // Ensure this is higher than the map's z-index
      },
      content: {
        zIndex: 1001,
         // Ensure this is higher than the map's z-index
      },
      width:'500px'
      
    }}
  >
    {location ? (
      <div >
         <p className="closebtn" onClick={onRequestClose}><MDBIcon fas icon="times-circle" /></p>
          <center>
        <h3><FaMapMarkerAlt style={{ fontSize:'15px',color:"whitesmoke", backgroundColor:'darkblue', padding:'3px', borderRadius:"50px"}} /> {location.name}</h3>
        <p><FaMapMarkerAlt /> Latitude: {location.lat}</p>
        <p><FaMapMarkerAlt /> Longitude: {location.lng}</p>
        <p className="datetime"> {location.time}</p>
        <p>Previous Travel History: {location.history}</p>
      
        <div className="container">
<div className="box" >
<li className="b-icon"><MDBIcon fas icon="tachometer-alt" /></li>
<li className="b-time">0.00 km/ph</li>
<li className="b-location">speed</li>
</div>
<div className="box" >
<li className="b-icon"><MDBIcon fas icon="long-arrow-alt-up" /></li>
<li className="b-time">0.00 km</li>
<li className="b-location">distance</li>
</div>
<div className="box" >
<li className="b-icon"><MDBIcon fas icon="battery-half" /></li>
<li className="b-time">16%</li>
<li className="b-location">Battery</li>
</div>
<div className="box" >
<li className="b-icon"><MDBIcon fas icon="running" /></li>
<li className="b-time">00h:00m</li>
<li className="b-location">today running</li>
</div>
<div className="box" >
<li className="b-icon"><FaMapMarkerAlt /></li>
<li className="b-time">0.00 km</li>
<li className="b-location">distance from last stop</li>
</div>
<div className="box" >
<li className="b-icon"><MDBIcon fas icon="street-view" /></li>
<li className="b-time">stopped</li>
<li className="b-location">current status</li>
</div>
<div className="box" >
<li className="b-icon"><FaMapMarkerAlt /></li>
<li className="b-time">00h:00m:00s</li>
<li className="b-location">Today Account ON</li>
</div>
<div className="box" >
<li className="b-icon"><FaMapMarkerAlt /></li>
<li className="b-time">00h:00m:00s</li>
<li className="b-location">Today Account off</li>
</div>
<div className="box" >
<li className="b-icon"><FaMapMarkerAlt /></li>
<li className="b-time">00:00:00</li>
<li className="b-location">location</li>
</div>

        </div>
        </center>
      </div>
    ) : (
      <p>No location data available</p>
      
    )}
   
  </Modal>
);

export default ModalComponent;
