import { useState, useEffect } from 'react'
import axios from 'axios'
import ScanStatus from './ScanStatus'
import EquationsList from './EquationsList'
import PapersList from './PapersList'
import ChatInterface from './ChatInterface'
import Calculator from './Calculator'

const Dashboard = ({ api }) => {
  const [activeTab, setActiveTab] = useState('status')
  const [scanStatus, setScanStatus] = useState(null)

  useEffect(() => {
    loadScanStatus()
    const interval = setInterval(loadScanStatus, 30000) // Refresh every 30s
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

  const tabs = [
    { id: 'status', label: 'SCAN_STATUS' },
    { id: 'equations', label: 'EQUATIONS' },
    { id: 'papers', label: 'PAPERS' },
    { id: 'chat', label: 'QUERY_AI' },
    { id: 'calculator', label: 'CALCULATOR' }
  ]

  return (
    <div className="min-h-screen bg-black text-[#00ff00] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border border-[#00ff00] p-4 mb-4">
          <pre className="text-xs">
{`╔════════════════════════════════════════════════════════════════╗
║  MATHEMATICAL SNIFFING AI                                      ║
║  Self-Learning Autonomous System                               ║
║  [OFFICIAL // AUSTEO # Kyle Roberts Digital Stamp]            ║
║  [PM-KR-2026-NSW]                                             ║
╚════════════════════════════════════════════════════════════════╝`}
          </pre>
          
          {scanStatus && (
            <div className="mt-4 text-xs space-y-1">
              <div>STATUS: <span className={scanStatus.is_active ? 'scan-pulse' : ''}>{scanStatus.is_active ? 'ACTIVE' : 'INACTIVE'}</span></div>
              <div>SCAN_FREQ: {scanStatus.current_frequency_hours}h</div>
              <div>LEARNING_RATE: {scanStatus.learning_rate.toFixed(2)} items/hour</div>
              <div>DATABASE: {scanStatus.total_equations} equations | {scanStatus.total_papers} papers</div>
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
          {activeTab === 'chat' && <ChatInterface api={api} />}
          {activeTab === 'calculator' && <Calculator api={api} />}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
