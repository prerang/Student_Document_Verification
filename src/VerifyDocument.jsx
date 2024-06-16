import React, { useState } from 'react';
import Web3 from 'web3';
import './styles.css';
import YourContractABI from "./YourContractABI.json";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function VerifyDocument() {
  const [studentId, setStudentId] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleStudentIdChange = (event) => {
    setStudentId(event.target.value);
  };

  const handleDocumentIdChange = (event) => {
    setDocumentId(event.target.value);
  };

  const handleVerifyDocument = async () => {
    if (!studentId || !documentId) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      // Get the contract instance
      const contractAddress = '0x396bB4871580248e46be7279a15fe5543D4024d5';
      const contractABI = YourContractABI;
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      // Call the verifyDocument function
      await contract.methods.verifyDocument(studentId, documentId).send({
        from: accounts[0],
      });

      // Handle success
      setMessage('Document verified successfully');
      setError('');
      toast.success('Document verified successfully');
    } catch (error) {
      console.error('Error verifying document:', error);
      setError('Error verifying document. Please try again.');
      toast.error('Error verifying document. Please try again.');
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="heading">Verify Document</h1>
      <div className="main-class">
        <div className="text_fields">
          <label htmlFor="studentId">Student ID:</label>
          <input id="studentId" type="text" placeholder="Student ID" value={studentId} onChange={handleStudentIdChange} />
        </div>
        <div className="text_fields">
          <label htmlFor="documentId">Document ID:</label>
          <input id="documentId" type="text" placeholder="Document ID" value={documentId} onChange={handleDocumentIdChange} />
        </div>
        <button onClick={handleVerifyDocument}>Verify Document</button>
        {message && (
          <div>
            <h2>Message:</h2>
            <p>{message}</p>
          </div>
        )}
        {error && (
          <div>
            <h2>Error:</h2>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyDocument;
