import React, { useState } from 'react'
import Text from './TextRecog/Text'
import Image from './imageRecog/Image'
import './App.css'
function App() {
  const category =  ['Image','Textual']
  const [clickedCategory, setClickedCategory] = useState('');
  const handleCategoryClick = (category) => {
    setClickedCategory(category);
    console.log(clickedCategory) // Update state with the clicked category
};
  return(
    <div>
      <div className='Navbar'>
        {
        category.map((category,index)=>(
          <button key={index} onClick={() => handleCategoryClick(category)}>{category}</button>
        ))
      }
      </div>
    <div  className='main-container'>
      <div className='text'>
        {
          clickedCategory === 'Image' ? <Image/> : <Text/>
        }
      </div>
    </div>
    </div>
  )
}

export default App
