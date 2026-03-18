import { useState, useEffect } from 'react'
import axios from 'axios'

const EquationsList = ({ api }) => {
  const [equations, setEquations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadEquations()
  }, [])

  const loadEquations = async () => {
    try {
      const response = await axios.get(`${api}/equations/list`)
      setEquations(response.data)
    } catch (err) {
      console.error('Equations load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredEquations = filter === 'all' 
    ? equations 
    : equations.filter(eq => eq.category === filter)

  const categories = ['all', 'Sacred Geometry', 'Fundamental Mathematics']

  if (loading) {
    return <div data-testid="equations-loading">Loading equations database...</div>
  }

  return (
    <div data-testid="equations-panel" className="font-mono text-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg border-b border-[#00ff00] pb-2">
          [EQUATIONS_DATABASE] ({filteredEquations.length})
        </h2>
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              data-testid={`filter-${cat}`}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 text-xs border border-[#00ff00] ${
                filter === cat ? 'bg-[#00ff00] text-black' : 'bg-transparent'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {filteredEquations.length === 0 ? (
        <div className="text-center py-8 opacity-50">
          No equations found. System will collect data during scans.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEquations.map((eq, idx) => (
            <div 
              key={eq.id || idx}
              data-testid={`equation-${idx}`}
              className="border border-[#00ff00] border-opacity-30 p-4 hover:border-opacity-100 transition-all"
            >
              <div className="text-lg mb-2 font-bold">{eq.equation}</div>
              <div className="text-xs opacity-70 mb-2">{eq.description}</div>
              
              <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                <div>
                  <span className="opacity-50">CATEGORY:</span> {eq.category}
                </div>
                <div>
                  <span className="opacity-50">SACRED_GEO_SCORE:</span> {eq.sacred_geometry_relevance?.toFixed(2) || 'N/A'}
                </div>
              </div>

              {eq.ai_analysis && (
                <div className="mt-3 p-2 border border-[#00ff00] border-opacity-20 bg-black bg-opacity-50">
                  <div className="text-xs opacity-50 mb-1">[AI_ANALYSIS]</div>
                  <div className="text-xs">{eq.ai_analysis}</div>
                </div>
              )}

              <div className="mt-2 text-xs opacity-30">
                SOURCE: {eq.source_url} | DISCOVERED: {new Date(eq.discovered_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EquationsList
