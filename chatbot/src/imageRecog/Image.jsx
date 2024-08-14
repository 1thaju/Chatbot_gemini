import React, { useState } from 'react';
import axios from 'axios';
import './image.css'
import Loading from '../Loading/Loading';
function Image() {
  const [picture, setPicture] = useState('');
  const [note, setNote] = useState('');
  const [input,setInput] = useState('');
  const [input1,setInput1] = useState('');  
  const [file, setFile] = useState(null);
  const [loading,setLoading] = useState(false)

  const handlePrompt = (e) =>{
    e.preventDefault()
    setInput(e.target.value)
    setInput1(e.target.value)    
  }
  const handleFileChange = (e)=>{
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPicture(URL.createObjectURL(selectedFile));
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('prompt',input)

    try {
      const response = await axios.post('http://localhost:3000/upload', formData,  {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        setNote( response.data.description);
      } else {
        setNote('No response data received');
      }

    } catch (error) {
      console.error('Error uploading file:', error);
      setNote('Error: File Not Uploaded');
    }
    setInput('')
    setFile(null)
    setLoading(false)
  };

  return (
    <div>
      <div className='message-container1'>
      {
       picture ?       <img src={picture} alt="Uploaded preview" style={{ width: '300px', height: 'auto' }} /> : ''
      }
      <p className='prompt1'>{input1}</p>
      {loading && (
        <label><Loading/></label>
      )}
     <p>{note}</p>
     
      </div>
      <form onSubmit={handleSubmit}>
      <input type="file" id="avatar" accept="image/png, image/jpeg" onChange={handleFileChange}/>
      <input value={input} placeholder='Enter Your Prompt for the Image' onChange={handlePrompt}/>
      <button className='button'>submit</button> 
      </form>
    </div>
  );
}

export default Image;
