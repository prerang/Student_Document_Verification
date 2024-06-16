import React, { useState } from 'react';
import { create } from 'ipfs-http-client';
import YourContractABI from "./YourContractABI.json";
import Web3 from 'web3';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css';

const ipfs = create({ host: 'localhost', port: 5001, protocol: 'http' });

function FileUpload() {
  const [file, setFile] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [documentInfo, setDocumentInfo] = useState('');
  const [hash, setHash] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleStudentIdChange = (event) => {
    setStudentId(event.target.value);
  };

  const handleDocumentIdChange = (event) => {
    setDocumentId(event.target.value);
  };

  const handleDocumentInfoChange = (event) => {
    setDocumentInfo(event.target.value);
  };

  const validateInputs = () => {
    if (!file || !studentId || !documentId || !documentInfo) {
      setError('Please fill in all fields');
      return false;
    }
    if (!/^\d+$/.test(studentId)) {
      setError('Student ID must be a number');
      return false;
    }
    return true;
  };

  const handleUpload = async () => {
    if (!validateInputs()) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('studentId', studentId);
      formData.append('documentId', documentId);
      formData.append('documentInfo', documentInfo);

      let cid;
      for await (const response of ipfs.addAll(formData)) {
        cid = response.cid.toString();
      }
      if (!cid || cid.trim() === '') {
        setError('Error uploading file to IPFS. No CID found in response.');
        return;
      }

      setHash(cid);
      setError(null);
      toast.success('File uploaded to IPFS successfully');
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      setError('Error uploading file to IPFS. Please try again.');
      toast.error('Error uploading file to IPFS');
    }
  };

  const handleAddToBlockchain = async () => {
    if (!hash) {
      setError('No file hash found. Please upload a file first.');
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

      await contract.methods.addDocument(studentId, documentId, hash, documentInfo).send({
        from: accounts[0],
      });

      console.log('Document added to blockchain successfully');
      toast.success('Document added to blockchain successfully');
    } catch (error) {
      console.error('Error adding document to blockchain:', error);
      setError('Error adding document to blockchain. Please try again.');
      toast.error('Error adding document to blockchain');
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="heading">Upload File to IPFS</h1>
      <div className="main-class">
        <div className="text_fields">
          <label htmlFor="studentId">Student ID:</label>
          <input id="studentId" type="text" placeholder="Student ID" value={studentId} onChange={handleStudentIdChange} />
        </div>
        <div className="text_fields">
          <label htmlFor="documentId">Document ID:</label>
          <input id="documentId" type="text" placeholder="Document ID" value={documentId} onChange={handleDocumentIdChange} />
        </div>
        <div className="text_fields">
          <label htmlFor="documentInfo">Document Info:</label>
          <input id="documentInfo" type="text" placeholder="Document Info" value={documentInfo} onChange={handleDocumentInfoChange} />
        </div>
        <div className="text_fields">
          <label>Choose File:</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button onClick={handleUpload} style={{ marginRight: "20px" }}>Upload</button>
        <button onClick={handleAddToBlockchain}>Add to blockchain</button>
        {hash && (
          <div>
            <h2>File Hash:</h2>
            <p>{hash}</p>
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

export default FileUpload;
