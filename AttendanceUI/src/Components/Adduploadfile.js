import React, { useState } from 'react';

function FileUploadForm() {
  const [proofFile, setProofFile] = useState(null);
  const [certificatesFile, setCertificatesFile] = useState(null);
  const [imgSrcFile, setImgSrcFile] = useState(null);

  const handleProofFileChange = (event) => {
    setProofFile(event.target.files[0]);
  };

  const handleCertificatesFileChange = (event) => {
    setCertificatesFile(event.target.files[0]);
  };

  const handleImgSrcFileChange = (event) => {
    setImgSrcFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Create a FormData object
    const formData = new FormData();
    formData.append('proof', proofFile, 'proof_filename.pdf');
    formData.append('certificates', certificatesFile, 'certificates_filename.pdf');
    formData.append('imgSrc', imgSrcFile, 'imgSrc_filename.pdf');
    // Send the form data to the server
    fetch('http://127.0.0.1:7000/attendance/upload_file/', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data); // File upload success message
      })
      .catch((error) => {
        console.error(error); // Handle error
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="proof">Proof File:</label>
        <input type="file" id="proof" name="proof" onChange={handleProofFileChange} />
      </div>
      <div>
        <label htmlFor="certificates">Certificates File:</label>
        <input type="file" id="certificates" name="certificates" onChange={handleCertificatesFileChange} />
      </div>
      <div>
        <label htmlFor="imgSrc">Image Source File:</label>
        <input type="file" id="imgSrc" name="imgSrc" onChange={handleImgSrcFileChange} />
      </div>
      <button type="submit">Upload Files</button>
    </form>
  );
}
export default FileUploadForm;