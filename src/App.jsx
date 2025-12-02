import { useState } from 'react'
import Home from './Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
      </Routes>
    </BrowserRouter>
  )
  
}

export default App
