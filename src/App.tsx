import React, { useState } from 'react';
import './App.css';
import DownloadButton from './component/DownloadButton';
import FileUploadForm from './component/FileUploadForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';


function App() {
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const [fileId,setFileId] = useState('')

  const handleUploadSuccess = (id:string) => {
    setShowDownloadButton(true);
    setFileId(id)
    console.log("id",id)
  };

  const handleDownload = async () => {
  
    
    try {
      const fileUrl=`http://localhost:3001/api/${fileId}/download`
      const response = await axios.get(fileUrl, { responseType: 'blob' });
  
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'downloaded_file.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('File downloaded successfully', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    } catch (error) {
      console.error('Error downloading file', error);
    }
    }
  
  return (
    <div>
       <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        />
    {showDownloadButton ? (
      <DownloadButton onDownload={handleDownload} />
    ) : (
      <FileUploadForm onUploadSuccess={handleUploadSuccess}  />
    )}
  </div>

  );
}

export default App;
