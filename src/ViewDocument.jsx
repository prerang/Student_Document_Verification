import React, { useState } from 'react';
import Web3 from 'web3';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css';
import YourContractABI from "./YourContractABI.json";

function ViewDoc() {
  const [studentId, setStudentId] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [error, setError] = useState(null);
  const [documentData, setDocumentData] = useState(null);

  const handleGetDocument = async () => {
    if (!studentId || !documentId) {
      toast.error('Please fill in all fields');
      setError('Please fill in all fields');
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const contractAddress = '0x396bB4871580248e46be7279a15fe5543D4024d5';
      const contractABI = YourContractABI;
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      const result = await contract.methods.getDocument(studentId, documentId).call({
        from: accounts[0],
      });

      setDocumentData(result);
      setError(null); // Clear any previous error
      toast.success('Document retrieved successfully');
    } catch (error) {
      console.error('Error getting document:', error);
      setError('Error getting document. Please try again.');
      toast.error('Error getting document. Please try again.');
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <ToastContainer />
      <h1 className="heading">View Document</h1>
      <div className="text_fields">
        <label htmlFor="getStudentId">Student ID for Document Retrieval:</label>
        <input
          id="getStudentId"
          type="text"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
      </div>
      <div className="text_fields">
        <label htmlFor="getDocumentId">Document ID for Retrieval:</label>
        <input
          id="getDocumentId"
          type="text"
          placeholder="Document ID"
          value={documentId}
          onChange={(e) => setDocumentId(e.target.value)}
        />
      </div>
      <button onClick={handleGetDocument}>Get Document</button>
      {documentData && (
        <div>
          <h2>Retrieved Document Data:</h2>
          <p>Document Hash: {documentData[0]}</p>
          <p>Document Info: {documentData[1]}</p>
          <p>Document Status: {documentData[2] ? 'Verified' : 'Not Verified'}</p>
        </div>
      )}
      {error && (
        <div>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default ViewDoc;
