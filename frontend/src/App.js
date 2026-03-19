import { useState } from 'react'
import '@/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainCalculator from './components/MainCalculator'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainCalculator />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
