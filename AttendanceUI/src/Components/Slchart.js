import axios from 'axios';

const handleFormSubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData();
  const fileInput = document.getElementById('file-input');
  formData.append('file', fileInput.files[0]);

  try {
    const response = await axios.post('https://smrftattendance.onrender.com/attendance/upload_file/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log(response.data); // Response from the server
  } catch (error) {
    console.error(error);
  }
};

const UploadForm = () => {
  return (
    <form id="upload-form" encType="multipart/form-data" onSubmit={handleFormSubmit}>
      <input type="file" name="file" id="file-input" />
      <button type="submit">Upload</button>
    </form>
  );
};

export default UploadForm;
