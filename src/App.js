import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register';
import GetDetails from './Get_Details';
import FileUpload from './File_Upload';
import ViewDoc from './ViewDocument';
import VerifyDocument from './VerifyDocument';
import NavBar from './NavBar';

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/Register" element={<Register />} />
          <Route path="/GetDetails" element={<GetDetails />} />
          <Route path="/FileUpload" element={<FileUpload />} />
          <Route path="/VerifyDocument" element={<VerifyDocument />} />
          <Route path="/ViewDoc" element={<ViewDoc />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
