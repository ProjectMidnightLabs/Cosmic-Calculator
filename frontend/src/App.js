import { useState, useEffect } from 'react'
import '@/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import axios from 'axios'
import AuthGate from './components/AuthGate'
import Dashboard from './components/Dashboard'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const API = `${BACKEND_URL}/api`

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authToken, setAuthToken] = useState(null)

  const handleAuthSuccess = (token) => {
    setIsAuthenticated(true)
    setAuthToken(token)
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            isAuthenticated ? (
              <Dashboard api={API} />
            ) : (
              <AuthGate api={API} onAuthSuccess={handleAuthSuccess} />
            )
          } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
