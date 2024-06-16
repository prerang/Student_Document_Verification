// NavBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/Register">Register</Link></li>
        <li><Link to="/FileUpload">Upload</Link></li>
        <li><Link to="/GetDetails">Get Details</Link></li>
        <li><Link to="/VerifyDocument">Verify</Link></li>
        <li><Link to="/ViewDoc">Check Status</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;
