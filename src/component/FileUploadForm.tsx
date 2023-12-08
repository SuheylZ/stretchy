// FileUploadForm.tsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FileUploadFormProps {
  onUploadSuccess: (id: string) => void;
}

const FileUploadForm: React.FC<FileUploadFormProps> = ({ onUploadSuccess}) => {
  const [file, setFile] = useState<File | null>(null);
  const [textInputs, setTextInputs] = useState<string[]>(['']);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handletextChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newInputs = [...textInputs];
    newInputs[index] = event.target.value;
    setTextInputs(newInputs);
  };

  const handleAddInput = () => {
    setTextInputs([...textInputs, '']);
  };

  const handleRemoveInput = (index: number) => () => {
    const newInputs = [...textInputs];
    newInputs.splice(index, 1);
    setTextInputs(newInputs);
  };  
  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (file) {
        console.log("file",file)
      const formData = new FormData();
      formData.append('indices',textInputs.join(','))
      formData.append('file', file);

      try {
        const url = 'http://localhost:3001/api/upload';
        // Replace '/fileupload' with your actual API endpoint
        const response = await axios.post(url, formData);

        if (response.status === 200) {
          // Call the callback function to open the download component on success
          onUploadSuccess(response.data.id);
        } else {
            toast.error('file upload failed',{
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
      } catch (error:any) {
        // console.log(error.response.data)
        toast.error(error?.response?.data ?? error.message,{
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleFormSubmit}>
        <div style={{ display: 'grid' }}>
          <div>
            <input type="file" onChange={handleFileChange} />
          </div>
          {textInputs.map((input, index) => (
            <div key={index}>
              <input type="text" value={input} onChange={handletextChange(index)} />
              <button type="button" onClick={handleRemoveInput(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddInput}>
            Add Input
          </button>
          <button type="submit">Upload</button>
        </div>
      </form>
    </div>
  );
};

export default FileUploadForm;
