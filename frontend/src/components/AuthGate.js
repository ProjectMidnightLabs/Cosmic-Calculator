import { useState } from 'react'
import axios from 'axios'

const AuthGate = ({ api, onAuthSuccess }) => {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAuth = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post(`${api}/auth/verify`, {
        name,
        location
      })

      if (response.data.authenticated) {
        onAuthSuccess(response.data.token)
      } else {
        setError(response.data.message)
      }
    } catch (err) {
      setError('Authentication system error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 border border-[#00ff00]">
        <div className="mb-8">
          <pre className="text-[#00ff00] text-sm mb-2">
            {`
╔══════════════════════════════════╗
║  MATHEMATICAL INTELLIGENCE       ║
║  AUTHENTICATION REQUIRED         ║
║  [PM-KR-2026-NSW]               ║
╚══════════════════════════════════╝
            `}
          </pre>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-[#00ff00] text-sm mb-2">
              &gt; IDENTITY_NAME:
            </label>
            <input
              data-testid="auth-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              className="w-full bg-black border border-[#00ff00] text-[#00ff00] p-2 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-[#00ff00] text-sm mb-2">
              &gt; LOCATION_ORIGIN:
            </label>
            <input
              data-testid="auth-location-input"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State/Region"
              className="w-full bg-black border border-[#00ff00] text-[#00ff00] p-2 font-mono"
              required
            />
          </div>

          {error && (
            <div data-testid="auth-error" className="text-red-500 text-sm border border-red-500 p-2">
              [ERROR] {error}
            </div>
          )}

          <button
            data-testid="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full bg-transparent border border-[#00ff00] text-[#00ff00] py-3 hover:bg-[#00ff00] hover:text-black transition-all font-mono"
          >
            {loading ? '[VERIFYING...]' : '[VERIFY_IDENTITY]'}
          </button>
        </form>

        <div className="mt-8 text-xs text-[#00ff00] opacity-50 text-center">
          <p>AUTHORIZED ACCESS ONLY</p>
          <p>DIGITAL STAMP VERIFICATION REQUIRED</p>
        </div>
      </div>
    </div>
  )
}

export default AuthGate
