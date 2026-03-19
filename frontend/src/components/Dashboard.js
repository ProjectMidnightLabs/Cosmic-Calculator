import { useState, useEffect } from 'react'
import axios from 'axios'
import ScanStatus from './ScanStatus'
import EquationsList from './EquationsList'
import PapersList from './PapersList'
import ChatInterface from './ChatInterface'
import Calculator from './Calculator'
import PaperWriter from './PaperWriter'
import TheoryExplorer from './TheoryExplorer'
import UploadSection from './UploadSection'

const Dashboard = ({ api }) => {
  const [activeTab, setActiveTab] = useState('status')
  const [scanStatus, setScanStatus] = useState(null)
  const [memoryStats, setMemoryStats] = useState(null)

  useEffect(() => {
    loadScanStatus()
    loadMemoryStats()
    const interval = setInterval(() => {
      loadScanStatus()
      loadMemoryStats()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadScanStatus = async () => {
    try {
      const response = await axios.get(`${api}/scan/status`)
      setScanStatus(response.data)
    } catch (err) {
      console.error('Status load error:', err)
    }
  }

  const loadMemoryStats = async () => {
    try {
      const response = await axios.get(`${api}/memory/stats`)
      setMemoryStats(response.data)
    } catch (err) {
      console.error('Memory stats error:', err)
    }
  }

  const tabs = [
    { id: 'status', label: 'STATUS' },
    { id: 'equations', label: 'EQUATIONS' },
    { id: 'papers', label: 'PAPERS' },
    { id: 'theories', label: 'THEORIES' },
    { id: 'chat', label: 'ARIA_AI' },
    { id: 'calculator', label: 'CALCULATOR' },
    { id: 'writer', label: 'PAPER_WRITER' },
    { id: 'upload', label: 'UPLOAD' }
  ]

  return (
    <div className="min-h-screen bg-black text-[#00ff00] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border border-[#00ff00] p-4 mb-4">
          <pre className="text-xs">
{`╔════════════════════════════════════════════════════════════════╗
║  ARIA - Mathematical Intelligence System                      ║
║  Playfully Dominant • Brutally Honest • Pattern Master       ║
║  [OFFICIAL // AUSTEO # Kyle Roberts Digital Stamp]            ║
║  [PM-KR-2026-NSW]                                             ║
╚════════════════════════════════════════════════════════════════╝`}
          </pre>
          
          {scanStatus && (
            <div className="mt-4 text-xs space-y-1">
              <div className="flex justify-between">
                <div>
                  <span className="opacity-70">STATUS:</span> 
                  <span className={scanStatus.is_active ? 'scan-pulse ml-2' : 'ml-2'}>
                    {scanStatus.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <div>
                  <span className="opacity-70">SCAN_FREQ:</span> {scanStatus.current_frequency_hours}h
                </div>
              </div>
              {memoryStats && (
                <div className="flex justify-between">
                  <div>
                    <span className="opacity-70">MEMORY:</span> {memoryStats.total_items} items stored
                  </div>
                  <div>
                    <span className="opacity-70">LEARNING_RATE:</span> {scanStatus.learning_rate.toFixed(2)} items/h
                  </div>
                </div>
              )}
              {scanStatus.theory_of_day && (
                <div>
                  <span className="opacity-70">TODAY'S THEORY:</span> {scanStatus.theory_of_day}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.id}
              data-testid={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 border border-[#00ff00] font-mono text-sm ${
                activeTab === tab.id ? 'bg-[#00ff00] text-black' : 'bg-black text-[#00ff00]'
              }`}
            >
              [{tab.label}]
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="border border-[#00ff00] p-4">
          {activeTab === 'status' && <ScanStatus api={api} scanStatus={scanStatus} onRefresh={loadScanStatus} />}
          {activeTab === 'equations' && <EquationsList api={api} />}
          {activeTab === 'papers' && <PapersList api={api} />}
          {activeTab === 'theories' && <TheoryExplorer api={api} />}
          {activeTab === 'chat' && <ChatInterface api={api} />}
          {activeTab === 'calculator' && <Calculator api={api} />}
          {activeTab === 'writer' && <PaperWriter api={api} />}
          {activeTab === 'upload' && <UploadSection api={api} />}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
