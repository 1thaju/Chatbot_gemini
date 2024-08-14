import React, { useState } from 'react'
import { GoogleGenerativeAI } from "@google/generative-ai";
import './text.css'
import Loading from '../Loading/Loading';

function Text() {
    const [inputText,setInputText] = useState('')
    const [input,setInput] = useState('')
    const [message,setMessage] = useState('')
    const [loading, setLoading] = useState(false);
    const apikey = import.meta.env.VITE_API_KEY;
    const genAI = new GoogleGenerativeAI(apikey);
  
  
    const handleInput = (e) =>{
      setInputText(e.target.value)
      setInput(e.target.value)
    }
    const handleSubmit = (e) =>{
      e.preventDefault();
      setLoading(true);
      setInput('')
      async function run() {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
      
        const prompt = inputText
      
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        console.log({inputText})
        console.log(text);
        setMessage(text)
        setLoading(false)
      }
      
      run();
    }
  
    return (
      <div className='container_text'>
        <div className='message-container'>
          <p className='prompt'>{inputText}</p>
          {loading && (
          <label><Loading/></label>
          )}
        <p className='description'>{message}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input value={input} placeholder='Enter Your Prompt Here' onChange={handleInput}/>
          <button className='button'>Submit</button>
        </form>
        
      </div>
    )
  }

export default Text
