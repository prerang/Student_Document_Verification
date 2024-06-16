import React, { useState, useEffect } from "react";
import Web3 from "web3";
import YourContractABI from "./YourContractABI.json"; // Import your contract ABI

const GetDetails = () => {
  const [instituteId, setInstituteId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [show, setShow] = useState("login");
  const [contract, setContract] = useState(null);
  const [fetchedInstitute, setFetchedInstitute] = useState(null);
  const [fetchedStudent, setFetchedStudent] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    connectToMetaMask();
  }, []);

  const connectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        const contractInstance = new web3.eth.Contract(
          YourContractABI,
          "0x396bB4871580248e46be7279a15fe5543D4024d5" // Replace with your contract address
        );
        setContract(contractInstance);
        setLoading(false); // Set loading to false after contract is set
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        setLoading(false); // Set loading to false even on error
      }
    } else {
      console.error("MetaMask not detected");
      setLoading(false); // Set loading to false if MetaMask is not detected
    }
  };

  const handleGetInstitute = async () => {
    if (!contract) {
      console.error("Contract not initialized");
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const instituteInfo = await contract.methods.getInstitute(instituteId).call({
        from: accounts[0],
      });
      console.log("Institute Info:", instituteInfo);
      setFetchedInstitute(instituteInfo);
    } catch (error) {
      console.error("Error getting institute:", error);
    }
  };

  const handleGetStudent = async () => {
    if (!contract) {
      console.error("Contract not initialized");
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const studentInfo = await contract.methods.getStudent(studentId).call({
        from: accounts[0],
      });
      console.log("Student Info:", studentInfo);
      setFetchedStudent(studentInfo);
    } catch (error) {
      console.error("Error getting student:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", justifyContent: "center" }}>
      <h1 className="heading">Get Details</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        show === "login" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <input
                type="text"
                placeholder="Institute ID"
                value={instituteId}
                onChange={(e) => setInstituteId(e.target.value)}
                style={{ marginRight: "20px" }}
              />
              <button onClick={handleGetInstitute}>Get Institute Record</button>
            </div>
            {fetchedInstitute && (
              <div>
                <h3>Fetched Institute Data:</h3>
                <p>Name: {fetchedInstitute[0]}</p>
                <p>Email: {fetchedInstitute[1]}</p>
                <p>Address: {fetchedInstitute[2]}</p>
              </div>
            )}
            <div style={{ marginBottom: "20px" }}>
              <input
                type="text"
                placeholder="Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                style={{ marginRight: "20px" }}
              />
              <button onClick={handleGetStudent}>Get Student Record</button>
            </div>
            {fetchedStudent && (
              <div>
                <h3>Fetched Student Data:</h3>
                <p>Name: {fetchedStudent[0]}</p>
                <p>Email: {fetchedStudent[1]}</p>
                <p>Institute ID: {fetchedStudent[2].toString()}</p>
                <p>Address: {fetchedStudent[3]}</p>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default GetDetails;
