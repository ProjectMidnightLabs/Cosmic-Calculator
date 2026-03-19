import { useState, useEffect } from 'react'
import axios from 'axios'
import { RefreshCw } from 'lucide-react'

const TheoryExplorer = ({ api }) => {
  const [theoryOfDay, setTheoryOfDay] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTheoryOfDay()
  }, [])

  const loadTheoryOfDay = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${api}/theories/today`)
      setTheoryOfDay(response.data)
    } catch (err) {
      console.error('Theory load error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>ARIA exploring today's theory...</div>
  }

  return (
    <div data-testid="theory-panel" className="font-mono text-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg border-b border-[#00ff00] pb-2">
          [DAILY THEORY EXPLORATION]
        </h2>
        <button
          onClick={loadTheoryOfDay}
          className="px-3 py-1 border border-[#00ff00] hover:bg-[#00ff00] hover:text-black text-xs flex items-center gap-1"
        >
          <RefreshCw size={12} />
          REFRESH
        </button>
      </div>

      <div className="mb-4 text-xs opacity-70 p-3 border border-[#00ff00] border-opacity-30 bg-[#00ff00] bg-opacity-5">
        <div className="font-bold mb-2">Theory Exploration System:</div>
        <div>• ARIA randomly picks 1 published theory per day</div>
        <div>• Conducts mental experiments and deep analysis</div>
        <div>• 100% honest assessment - no sugar coating</div>
        <div>• Truth rating based on logical consistency</div>
        <div>• Suggests experiments and provides brutal honesty</div>
      </div>

      {theoryOfDay ? (
        <div className="border border-[#00ff00] p-4 bg-[#00ff00] bg-opacity-5">
          <div className="text-2xl font-bold mb-4 text-center">
            {theoryOfDay.theory}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-center">
            <div className="border border-[#00ff00] border-opacity-30 p-3">
              <div className="text-xs opacity-50">EXPLORATION DATE</div>
              <div className="text-sm mt-1">{new Date(theoryOfDay.exploration_date).toLocaleDateString()}</div>
            </div>
            <div className="border border-[#00ff00] border-opacity-30 p-3">
              <div className="text-xs opacity-50">TRUTH RATING</div>
              <div className="text-xl mt-1">{(theoryOfDay.truth_rating * 100).toFixed(0)}%</div>
            </div>
          </div>

          <div className="mb-4 p-3 border border-[#00ff00] border-opacity-30">
            <div className="text-sm opacity-70 mb-2 font-bold">[ARIA'S ANALYSIS]</div>
            <div className="text-xs leading-relaxed whitespace-pre-wrap">
              {theoryOfDay.ai_analysis}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm opacity-70 mb-2 font-bold">[EXPERIMENTS CONDUCTED]</div>
            <div className="space-y-1">
              {theoryOfDay.experiments_conducted?.map((exp, idx) => (
                <div key={idx} className="text-xs flex items-center gap-2">
                  <span className="text-[#00ff00]">✓</span>
                  {exp}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 border border-[#00ff00] bg-black">
            <div className="text-sm opacity-70 mb-2 font-bold">[KEY FINDINGS]</div>
            <div className="text-xs leading-relaxed">
              {theoryOfDay.findings}
            </div>
          </div>

          <div className="mt-4 text-xs opacity-50 text-center">
            SOURCE: {theoryOfDay.source}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 opacity-50">
          No theory explored yet today. ARIA will pick one at midnight.
        </div>
      )}
    </div>
  )
}

export default TheoryExplorer
