import { useState } from 'react'
import axios from 'axios'

const ScanStatus = ({ api, scanStatus, onRefresh }) => {
  const [loading, setLoading] = useState(false)

  const triggerScan = async () => {
    setLoading(true)
    try {
      await axios.post(`${api}/scan/trigger`)
      setTimeout(() => {
        onRefresh()
        setLoading(false)
      }, 3000)
    } catch (err) {
      console.error('Scan trigger error:', err)
      setLoading(false)
    }
  }

  if (!scanStatus) {
    return <div>Loading system status...</div>
  }

  return (
    <div data-testid="scan-status-panel" className="space-y-6 font-mono text-sm">
      <div>
        <h2 className="text-lg mb-4 border-b border-[#00ff00] pb-2">
          [AUTONOMOUS_SCANNING_SYSTEM]
        </h2>
        
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[#00ff00] opacity-70">SCAN FREQUENCY:</div>
              <div className="text-xl">{scanStatus.current_frequency_hours} HOURS</div>
            </div>
            <div>
              <div className="text-[#00ff00] opacity-70">LEARNING RATE:</div>
              <div className="text-xl">{scanStatus.learning_rate.toFixed(2)} items/h</div>
            </div>
          </div>

          <div className="mt-4 p-3 border border-[#00ff00] border-opacity-30">
            <div className="text-[#00ff00] opacity-70 mb-2">NEXT SCAN:</div>
            <div>{new Date(scanStatus.next_scan).toLocaleString()}</div>
          </div>

          <div className="mt-4 p-3 border border-[#00ff00] border-opacity-30">
            <div className="text-[#00ff00] opacity-70 mb-2">LAST SCAN:</div>
            <div>{new Date(scanStatus.last_scan).toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-md mb-3 border-b border-[#00ff00] border-opacity-30 pb-2">
          [DATABASE_STATISTICS]
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="border border-[#00ff00] border-opacity-30 p-3">
            <div className="text-2xl">{scanStatus.total_equations}</div>
            <div className="text-xs opacity-70">EQUATIONS</div>
          </div>
          <div className="border border-[#00ff00] border-opacity-30 p-3">
            <div className="text-2xl">{scanStatus.total_papers}</div>
            <div className="text-xs opacity-70">PAPERS</div>
          </div>
          <div className="border border-[#00ff00] border-opacity-30 p-3">
            <div className="text-2xl">{scanStatus.total_sources}</div>
            <div className="text-xs opacity-70">SOURCES</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-md mb-3 border-b border-[#00ff00] border-opacity-30 pb-2">
          [SYSTEM_BEHAVIOR]
        </h3>
        <div className="space-y-2 text-xs">
          <div>• Initial scan frequency: 4 hours</div>
          <div>• Accelerates to 1 hour when learning rate increases</div>
          <div>• Autonomous source discovery enabled</div>
          <div>• Multi-model AI analysis (Claude + GPT)</div>
          <div>• Sacred geometry pattern detection active</div>
          <div>• Data stored in MongoDB (digital landscape)</div>
        </div>
      </div>

      <button
        data-testid="trigger-scan-btn"
        onClick={triggerScan}
        disabled={loading}
        className="w-full py-3 border border-[#00ff00] bg-transparent text-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all"
      >
        {loading ? '[SCANNING...]' : '[TRIGGER_MANUAL_SCAN]'}
      </button>
    </div>
  )
}

export default ScanStatus
