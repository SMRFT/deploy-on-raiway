import React, { useState } from 'react';
import axios from 'axios';

const FileUploadForm = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [certificatesFile, setCertificatesFile] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (event.target.name === 'proof') {
      setProofFile(file);
    } else if (event.target.name === 'certificates') {
      setCertificatesFile(file);
    } else if (event.target.name === 'imgSrc') {
      setProfileImageFile(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('employee_name', employeeName);
    formData.append('employee_id', employeeId);
    formData.append('proof', proofFile);
    formData.append('certificates', certificatesFile);
    formData.append('imgSrc', profileImageFile);

    try {
      await axios.post('http://127.0.0.1:7000/attendance/upload_file/', formData);
      // Handle successful file upload
      console.log('Files uploaded successfully');
    } catch (error) {
      // Handle error
      console.error('File upload failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="col-sm-6">
        <div className="mx-5 form-group">
          <input
            id="formFileMultiple"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            multiple
            hidden
            name="certificates"
          />
          <b>Choose Certificates (multiple file select):</b>
          <label
            htmlFor="formFileMultiple"
            className="mx-4 bi bi-folder-plus"
            style={{
              fontSize: "40px",
              color: "#00A693",
              opacity: "9.9",
              WebkitTextStroke: "2.0px",
              cursor: "pointer",
            }}
          ></label>
          {certificatesFile && (
            <>
              <span className="mx-3">{certificatesFile.name}</span>
              <button className="btn btn-danger" onClick={() => setCertificatesFile(null)}>
                <i className="fa fa-times"></i>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="col-sm-6">
        <div className="mx-5 form-group">
          <input
            id="selectFile"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            hidden
            name="proof"
          />
          <b>Choose PAN or Aadhaar proof:</b>
          <label
            htmlFor="selectFile"
            className="mx-4 bi bi-folder-check"
            style={{
              fontSize: "40px",
              color: "#00A693",
              opacity: "9.9",
              WebkitTextStroke: "2.0px",
              cursor: "pointer",
            }}
          ></label>
          {proofFile && (
            <>
              <span className="mx-3">{proofFile.name}</span>
              <button className="btn btn-danger" onClick={() => setProofFile(null)}>
                <i className="fa fa-times"></i>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="col-sm-6">
        <div className="mx-5 form-group">
          <input
            id="imageFile"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
            name="imgSrc"
          />
          <b>Choose Profile Image:</b>
          <label
            htmlFor="imageFile"
            className="mx-4 bi bi-folder-image"
            style={{
              fontSize: "40px",
              color: "#00A693",
              opacity: "9.9",
              WebkitTextStroke: "2.0px",
              cursor: "pointer",
            }}
          ></label>
          {profileImageFile && (
            <>
              <span className="mx-3">{profileImageFile.name}</span>
              <button className="btn btn-danger" onClick={() => setProfileImageFile(null)}>
                <i className="fa fa-times"></i>
              </button>
            </>
          )}
        </div>
      </div>

      <button type="submit">Upload Files</button>
    </form>
  );
};

export default FileUploadForm;
