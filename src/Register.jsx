import React, { useState, useEffect } from "react";
import Web3 from "web3";
import YourContractABI from "./YourContractABI.json"; // Import your contract ABI
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [instituteName, setInstituteName] = useState("");
  const [instituteEmail, setInstituteEmail] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [instituteId, setInstituteId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentAddress, setStudentAddress] = useState("");
  const [instituteAddress, setInstituteAddress] = useState("");
  const [show, setShow] = useState("login");
  const [contract, setContract] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [errors, setErrors] = useState({}); // For validation errors

  useEffect(() => {
    // Connect to MetaMask on component mount
    connectToMetaMask();
  }, []);

  const connectToMetaMask = async () => {
    // Check if MetaMask is installed
    if (window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });
        // Set up Web3 provider
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);
        // Get accounts
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        // Load contract
        const contract = new web3.eth.Contract(
          YourContractABI,
          "0x396bB4871580248e46be7279a15fe5543D4024d5" // Replace with your contract address
        );
        setContract(contract);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask not detected");
    }
  };

  const validateInstitute = () => {
    let errors = {};
    if (!instituteId) {
      errors.instituteId = "Institute ID is required";
    }
    if (!instituteName) {
      errors.instituteName = "Institute Name is required";
    }
    if (!instituteEmail) {
      errors.instituteEmail = "Institute Email is required";
    } else if (!/\S+@\S+\.\S+/.test(instituteEmail)) {
      errors.instituteEmail = "Email address is invalid";
    }
    if (!instituteAddress) {
      errors.instituteAddress = "Institute Address is required";
    }
    return errors;
  };

  const validateStudent = () => {
    let errors = {};
    if (!studentId) {
      errors.studentId = "Student ID is required";
    }
    if (!studentName) {
      errors.studentName = "Student Name is required";
    }
    if (!studentEmail) {
      errors.studentEmail = "Student Email is required";
    } else if (!/\S+@\S+\.\S+/.test(studentEmail)) {
      errors.studentEmail = "Email address is invalid";
    }
    if (!instituteId) {
      errors.instituteId = "Institute ID is required";
    }
    if (!studentAddress) {
      errors.studentAddress = "Student Address is required";
    }
    return errors;
  };

  // Function to register institute
  const handleRegisterInstitute = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const validationErrors = validateInstitute();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await contract.methods
        .registerInstitute(
          parseInt(instituteId), // Convert to integer
          instituteName,
          instituteEmail,
          instituteAddress
        )
        .send({ from: account });
      toast.success("Institute registered successfully");
    } catch (error) {
      console.error("Error registering institute:", error);
      toast.error("Error registering institute");
    }
  };

  // Function to register student
  const handleRegisterStudent = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const validationErrors = validateStudent();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await contract.methods
        .registerStudent(
          parseInt(studentId), // Convert to integer
          studentName,
          studentEmail,
          parseInt(instituteId), // Convert to integer
          studentAddress
        )
        .send({ from: account });
      toast.success("Student registered successfully");
    } catch (error) {
      console.error("Error registering student:", error);
      toast.error("Error registering student");
    }
  };

  return (
    <div className="Register" style={{ textAlign: "center", justifyContent: "center" }}>
      <ToastContainer />
      {show === "login" && (
        <div>
          <button onClick={() => setShow("institute")} style={{ marginRight: "20px", marginTop: "200px" }}>
            Sign up as Institute
          </button>
          <button onClick={() => setShow("student")}>Sign up as Student</button>
        </div>
      )}

      {show === "institute" && (
        <div style={{ marginTop: "100px" }}>
          <h2>Institute Signup</h2>
          <form onSubmit={handleRegisterInstitute}>
            <input
              type="text"
              placeholder="Institute ID"
              value={instituteId}
              onChange={(e) => setInstituteId(e.target.value)}
            />
            {errors.instituteId && <p style={{ color: "red" }}>{errors.instituteId}</p>}
            <br/>
            <input
              type="text"
              placeholder="Institute Name"
              value={instituteName}
              onChange={(e) => setInstituteName(e.target.value)}
            />
            {errors.instituteName && <p style={{ color: "red" }}>{errors.instituteName}</p>}
            <br/>
            <input
              type="email"
              placeholder="Institute Email"
              value={instituteEmail}
              onChange={(e) => setInstituteEmail(e.target.value)}
            />
            {errors.instituteEmail && <p style={{ color: "red" }}>{errors.instituteEmail}</p>}
            <br/>
            <input
              type="text"
              placeholder="Institute Address"
              value={instituteAddress}
              onChange={(e) => setInstituteAddress(e.target.value)}
            />
            {errors.instituteAddress && <p style={{ color: "red" }}>{errors.instituteAddress}</p>}
            <br/>
            <button type="submit">Register</button>
          </form>
        </div>
      )}
      {show === "student" && (
        <div style={{ marginTop: "100px" }}>
          <h2>Student Signup</h2>
          <form onSubmit={handleRegisterStudent}>
            <input
              type="text"
              placeholder="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
            {errors.studentId && <p style={{ color: "red" }}>{errors.studentId}</p>}
            <br/>
            <input
              type="text"
              placeholder="Student Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
            {errors.studentName && <p style={{ color: "red" }}>{errors.studentName}</p>}
            <br/>
            <input
              type="email"
              placeholder="Student Email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
            />
            {errors.studentEmail && <p style={{ color: "red" }}>{errors.studentEmail}</p>}
            <br/>
            <input
              type="text"
              placeholder="Institute ID"
              value={instituteId}
              onChange={(e) => setInstituteId(e.target.value)}
            />
            {errors.instituteId && <p style={{ color: "red" }}>{errors.instituteId}</p>}
            <br/>
            <input
              type="text"
              placeholder="Student Address"
              value={studentAddress}
              onChange={(e) => setStudentAddress(e.target.value)}
            />
            {errors.studentAddress && <p style={{ color: "red" }}>{errors.studentAddress}</p>}
            <br/>
            <button type="submit">Register</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Register;
