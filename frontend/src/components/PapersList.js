import { useState, useEffect } from 'react'
import axios from 'axios'
import { Beaker, ExternalLink } from 'lucide-react'

const PapersList = ({ api }) => {
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [experimentResult, setExperimentResult] = useState(null)
  const [experimentLoading, setExperimentLoading] = useState(null)

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

  const conductExperiment = async (paperId) => {
    setExperimentLoading(paperId)
    try {
      const response = await axios.post(`${api}/papers/${paperId}/experiment`)
      setExperimentResult(response.data)
    } catch (err) {
      console.error('Experiment error:', err)
    } finally {
      setExperimentLoading(null)
    }
  }

  if (loading) {
    return <div data-testid="papers-loading">ARIA scanning papers database...</div>
  }

  return (
    <div data-testid="papers-panel" className="font-mono text-sm">
      <h2 className="text-lg mb-4 border-b border-[#00ff00] pb-2">
        [RESEARCH_PAPERS_DATABASE] ({papers.length})
      </h2>

      <div className="mb-4 text-xs opacity-70 p-3 border border-[#00ff00] border-opacity-30">
        <div className="font-bold mb-1">Enhanced Features:</div>
        <div>• Click experiment button for ARIA's unbiased logical review</div>
        <div>• Direct links to papers</div>
        <div>• AI-powered mathematical verification</div>
        <div>• Sacred geometry relevance scoring</div>
      </div>

      {experimentResult && (
        <div className="mb-4 p-4 border border-[#00ff00] bg-[#00ff00] bg-opacity-10">
          <div className="flex justify-between items-center mb-2">
            <div className="text-md font-bold">[EXPERIMENT RESULTS]</div>
            <button
              onClick={() => setExperimentResult(null)}
              className="text-xs px-2 py-1 border border-[#00ff00]"
            >
              CLOSE
            </button>
          </div>
          <div className="text-xs space-y-2">
            <div><span className="opacity-50">HYPOTHESIS:</span> {experimentResult.hypothesis}</div>
            <div><span className="opacity-50">METHODOLOGY:</span> {experimentResult.methodology}</div>
            <div className="mt-2 p-2 border border-[#00ff00] border-opacity-30">
              <div className="opacity-50 mb-1">ARIA'S CONCLUSION:</div>
              <div>{experimentResult.ai_conclusion}</div>
            </div>
          </div>
        </div>
      )}

      {papers.length === 0 ? (
        <div className="text-center py-8 opacity-50">
          No papers yet. ARIA will collect them during scans.
        </div>
      ) : (
        <div className="space-y-4">
          {papers.map((paper, idx) => (
            <div 
              key={paper.id || idx}
              data-testid={`paper-${idx}`}
              className="border border-[#00ff00] border-opacity-30 p-4 hover:border-opacity-100 transition-all hover:bg-[#00ff00] hover:bg-opacity-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
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

                  {paper.ai_review && (
                    <div className="mt-3 p-2 border border-[#00ff00] border-opacity-20 bg-black bg-opacity-50">
                      <div className="text-xs opacity-50 mb-1">[ARIA'S REVIEW]</div>
                      <div className="text-xs">{paper.ai_review}</div>
                    </div>
                  )}

                  <div className="mt-2 text-xs opacity-30">
                    DISCOVERED: {new Date(paper.discovered_at).toLocaleString()}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {paper.url && (
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 border border-[#00ff00] hover:bg-[#00ff00] hover:text-black text-xs flex items-center gap-1"
                    >
                      <ExternalLink size={12} />
                      PAPER
                    </a>
                  )}
                  
                  <button
                    onClick={() => conductExperiment(paper.id)}
                    disabled={experimentLoading === paper.id}
                    className="px-3 py-2 border border-[#00ff00] hover:bg-[#00ff00] hover:text-black text-xs flex items-center gap-1"
                  >
                    <Beaker size={12} />
                    {experimentLoading === paper.id ? 'TESTING...' : 'EXPERIMENT'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PapersList
