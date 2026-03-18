import { useState, useEffect } from 'react'
import axios from 'axios'

const PapersList = ({ api }) => {
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPapers()
  }, [])

  const loadPapers = async () => {
    try {
      const response = await axios.get(`${api}/papers/list`)
      setPapers(response.data)
    } catch (err) {
      console.error('Papers load error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div data-testid="papers-loading">Loading papers database...</div>
  }

  return (
    <div data-testid="papers-panel" className="font-mono text-sm">
      <h2 className="text-lg mb-4 border-b border-[#00ff00] pb-2">
        [RESEARCH_PAPERS_DATABASE] ({papers.length})
      </h2>

      {papers.length === 0 ? (
        <div className="text-center py-8 opacity-50">
          No papers found. System will collect data during scans.
        </div>
      ) : (
        <div className="space-y-4">
          {papers.map((paper, idx) => (
            <div 
              key={paper.id || idx}
              data-testid={`paper-${idx}`}
              className="border border-[#00ff00] border-opacity-30 p-4 hover:border-opacity-100 transition-all"
            >
              <div className="text-md mb-2 font-bold">{paper.title}</div>
              <div className="text-xs opacity-70 mb-2">AUTHORS: {paper.authors}</div>
              
              {paper.abstract && (
                <div className="text-xs mb-3 opacity-80">{paper.abstract}</div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="opacity-50">SOURCE:</span> {paper.source}
                </div>
                <div>
                  <span className="opacity-50">SACRED_GEO_SCORE:</span> {paper.sacred_geometry_score?.toFixed(2) || 'N/A'}
                </div>
              </div>

              {paper.math_topics && paper.math_topics.length > 0 && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {paper.math_topics.map((topic, i) => (
                    <span key={i} className="px-2 py-1 border border-[#00ff00] border-opacity-30 text-xs">
                      {topic}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-2 text-xs opacity-30">
                URL: {paper.url} | DISCOVERED: {new Date(paper.discovered_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PapersList
