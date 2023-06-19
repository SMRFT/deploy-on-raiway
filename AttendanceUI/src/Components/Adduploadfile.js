import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import "../Admin.css"

function App() {
  const webcamRef = useRef(null);
  const [matchingImages, setMatchingImages] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);

  const captureImage = () => {
    const video = webcamRef.current.video;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    const imageSrc = canvas.toDataURL('image/jpeg');
    setUploadedImage(imageSrc);
  };

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append('image', dataURItoBlob(uploadedImage));

      const response = await axios.post('http://127.0.0.1:7000/attendance/facial-recognition/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log("error after this"+ response.data)
      console.log("error after this-1"+ response.data)
      setMatchingImages(response.data.matching_images);
    } catch (error) {
      console.error(error);
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  };

  return (
    <body className='wecam'>
    <div>
      <h1>Facial Recognition App</h1>
      <div className='container3'>
        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
        <button onClick={captureImage}>Capture Image</button>
      </div>
      {uploadedImage && (
        <div>
          <img src={uploadedImage} alt="Uploaded" />
          <button onClick={uploadImage}>Upload Image</button>
        </div>
      )}
      {matchingImages.length > 0 && (
        <div>
          <h2>Matching Images:</h2>
          <ul>
            {Object.entries(matchingImages).map(([imageName, similarity]) => (
              <li key={imageName}>{`${imageName}: ${similarity}`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </body>
  );
}

export default App;
