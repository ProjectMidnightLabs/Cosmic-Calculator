import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Menu, Copy, Save, Volume2, PenTool, ChevronRight, ChevronLeft } from 'lucide-react'
import SideMenu from './SideMenu'
import DrawingPad from './DrawingPad'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const API = `${BACKEND_URL}/api`

const MainCalculator = () => {
  const [display, setDisplay] = useState('')
  const [history, setHistory] = useState([])
  const [savedFormulas, setSavedFormulas] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [playingSound, setPlayingSound] = useState(false)
  const [drawingPadOpen, setDrawingPadOpen] = useState(false)
  const [edgePanelOpen, setEdgePanelOpen] = useState(false)
  const audioContextRef = useRef(null)
  const oscillatorsRef = useRef([])

  useEffect(() => {
    const saved = localStorage.getItem('savedFormulas')
    if (saved) setSavedFormulas(JSON.parse(saved))
    const hist = localStorage.getItem('calcHistory')
    if (hist) setHistory(JSON.parse(hist))
  }, [])

  const handleButtonClick = (value) => {
    if (value === '=') {
      calculate()
    } else if (value === 'C') {
      setDisplay('')
    } else if (value === 'CE') {
      setDisplay(display.slice(0, -1))
    } else if (value === 'paste') {
      navigator.clipboard.readText().then(text => setDisplay(display + text))
    } else {
      setDisplay(display + value)
    }
  }

  const calculate = async () => {
    if (!display) return

    try {
      const expr = display
        .replace(/÷/g, '/')
        .replace(/×/g, '*')
        .replace(/π/g, 'pi')
        .replace(/φ/g, '(1+sqrt(5))/2')
        .replace(/√/g, 'sqrt(')
        .replace(/\^/g, '**')
        .replace(/!/g, 'factorial(')

      const response = await axios.post(`${API}/calculator`, { expression: expr })
      const result = response.data.result
      
      const newHistory = [{
        expression: display,
        result: result,
        latex: response.data.latex,
        timestamp: new Date().toISOString()
      }, ...history].slice(0, 50)
      
      setHistory(newHistory)
      localStorage.setItem('calcHistory', JSON.stringify(newHistory))
      setDisplay(result)
    } catch (err) {
      setDisplay('Error')
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const saveFormula = () => {
    if (!display) return
    const name = prompt('Name this formula:')
    if (name) {
      const newSaved = [...savedFormulas, { name, formula: display }]
      setSavedFormulas(newSaved)
      localStorage.setItem('savedFormulas', JSON.stringify(newSaved))
    }
  }

  const loadSavedFormula = (formula) => {
    setDisplay(formula)
  }

  const handleDrawingSave = async (drawingDataUrl) => {
    console.log('Drawing saved:', drawingDataUrl)
  }

  const playGoldenRatioSound = () => {
    if (playingSound) {
      stopSound()
      return
    }
    
    setPlayingSound(true)
    const phi = 1.618033988749895
    const baseFreq = 432 // Hz natural frequency
    
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    audioContextRef.current = audioCtx
    
    // Create master gain (very low volume - subconscious)
    const masterGain = audioCtx.createGain()
    masterGain.gain.value = 0.03 // Very subtle, just audible
    
    // Low frequency for feeling (subwoofer range)
    const bassOsc = audioCtx.createOscillator()
    const bassGain = audioCtx.createGain()
    bassOsc.frequency.value = 40 // Deep bass you can feel
    bassOsc.type = 'sine'
    bassGain.gain.value = 0.5
    bassOsc.connect(bassGain)
    bassGain.connect(masterGain)
    
    // Golden ratio harmonics
    const createHarmonic = (freq, type = 'sine') => {
      const osc = audioCtx.createOscillator()
      osc.frequency.value = freq
      osc.type = type
      osc.connect(masterGain)
      return osc
    }
    
    const oscillators = [
      bassOsc,
      createHarmonic(baseFreq),
      createHarmonic(baseFreq * phi),
      createHarmonic(baseFreq / phi),
      createHarmonic(baseFreq * phi * phi, 'triangle'),
      createHarmonic(baseFreq / (phi * phi), 'triangle'),
    ]
    
    oscillatorsRef.current = oscillators
    masterGain.connect(audioCtx.destination)
    
    // Start all oscillators
    oscillators.forEach(osc => osc.start())
    
    // Auto-stop after 30 seconds
    setTimeout(() => {
      if (playingSound) stopSound()
    }, 30000)
  }

  const stopSound = () => {
    if (oscillatorsRef.current.length > 0) {
      oscillatorsRef.current.forEach(osc => {
        try {
          osc.stop()
        } catch (e) {}
      })
      oscillatorsRef.current = []
    }
    setPlayingSound(false)
  }

  const buttons = [
    ['7', '8', '9', '÷', 'C'],
    ['4', '5', '6', '×', 'CE'],
    ['1', '2', '3', '-', '√'],
    ['0', '.', '=', '+', 'π'],
    ['sin(', 'cos(', 'tan(', '^', 'φ'],
    ['(', ')', 'log(', 'e', '!'],
    ['asin(', 'acos(', 'atan(', 'ln(', '%'],
    ['sinh(', 'cosh(', 'tanh(', '²', '³'],
  ]

  return (
    <div className="min-h-screen bg-black text-[#00ff00] relative overflow-hidden">
      {/* Hidden auth signature in code */}
      <div style={{display: 'none'}}>PM-KR-2026-NSW Kyle Roberts Nowra</div>
      
      {/* Extendable Edge Panel */}
      <div className={`fixed top-0 right-0 h-full z-50 transition-all duration-300 ${
        edgePanelOpen ? 'translate-x-0' : 'translate-x-[calc(100%-3rem)]'
      }`}>
        <div className="h-full flex">
          {/* Toggle Button */}
          <button
            onClick={() => setEdgePanelOpen(!edgePanelOpen)}
            className="w-12 h-full border-l-2 border-[#00ff00] bg-black hover:bg-[#00ff00] hover:text-black transition-all flex items-center justify-center"
          >
            {edgePanelOpen ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
          </button>
          
          {/* Panel Content */}
          <div className="w-64 bg-black border-l-2 border-[#00ff00] p-4 space-y-4">
            <div className="text-sm font-bold mb-4 border-b border-[#00ff00] pb-2">CONTROLS</div>
            
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-full p-3 border border-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all flex items-center gap-2"
            >
              <Menu size={20} />
              ARIA Menu
            </button>

            <button
              onClick={playGoldenRatioSound}
              className={`w-full p-3 border border-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all flex items-center gap-2 ${
                playingSound ? 'bg-[#00ff00] text-black animate-pulse' : ''
              }`}
            >
              <Volume2 size={20} />
              {playingSound ? 'Stop φ Sound' : 'φ Harmonics'}
            </button>

            <button
              onClick={() => setDrawingPadOpen(true)}
              className="w-full p-3 border border-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all flex items-center gap-2"
            >
              <PenTool size={20} />
              Drawing Pad
            </button>

            {playingSound && (
              <div className="text-xs opacity-70 p-3 border border-[#00ff00] border-opacity-30">
                <div className="mb-1">Golden Ratio Frequencies:</div>
                <div>• 40 Hz (feel)</div>
                <div>• 432 Hz (base)</div>
                <div>• 699 Hz (φ × base)</div>
                <div>• 267 Hz (base / φ)</div>
                <div className="mt-2 text-[#00ff00]">Subconscious harmonics active</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <SideMenu 
        isOpen={menuOpen} 
        onClose={() => setMenuOpen(false)}
        api={API}
      />

      <DrawingPad
        isOpen={drawingPadOpen}
        onClose={() => setDrawingPadOpen(false)}
        onSave={handleDrawingSave}
      />

      {/* Calculator Container */}
      <div className="max-w-2xl mx-auto p-4 pt-8 pb-20">
        {/* ARIA Suggestion Box */}
        <div className="mb-4 p-3 border border-[#00ff00] border-opacity-30 bg-[#00ff00] bg-opacity-5 text-xs">
          <div className="font-bold mb-1">ARIA Calculator</div>
          <div className="opacity-70">φ=(1+√5)/2, π, e, sin, cos, tan, log, powers, factorials</div>
        </div>

        {/* Calculator Display */}
        <div className="border-4 border-[#00ff00] bg-black shadow-[0_0_30px_#00ff00]">
          {/* Display Screen */}
          <div className="bg-[#001100] p-6 border-b-4 border-[#00ff00]">
            <div className="text-right font-mono">
              <div className="text-sm opacity-50 mb-2 h-6">
                {history[0] && `${history[0].expression} = ${history[0].result}`}
              </div>
              <input
                type="text"
                value={display}
                onChange={(e) => setDisplay(e.target.value)}
                className="w-full text-4xl bg-transparent border-none outline-none text-[#00ff00] text-right"
                placeholder="0"
                data-testid="calc-display"
              />
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => copyToClipboard(display)}
                className="flex-1 py-2 px-3 border border-[#00ff00] border-opacity-50 hover:bg-[#00ff00] hover:text-black text-xs flex items-center justify-center gap-1"
              >
                <Copy size={12} />
                COPY
              </button>
              <button
                onClick={saveFormula}
                className="flex-1 py-2 px-3 border border-[#00ff00] border-opacity-50 hover:bg-[#00ff00] hover:text-black text-xs flex items-center justify-center gap-1"
              >
                <Save size={12} />
                SAVE
              </button>
              <button
                onClick={() => handleButtonClick('paste')}
                className="flex-1 py-2 px-3 border border-[#00ff00] border-opacity-50 hover:bg-[#00ff00] hover:text-black text-xs"
              >
                PASTE
              </button>
            </div>
          </div>

          {/* Saved Formulas */}
          {savedFormulas.length > 0 && (
            <div className="p-3 border-b-2 border-[#00ff00] border-opacity-30 bg-[#001100]">
              <div className="text-xs opacity-70 mb-2">SAVED:</div>
              <div className="flex gap-2 flex-wrap">
                {savedFormulas.map((sf, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadSavedFormula(sf.formula)}
                    className="px-3 py-1 border border-[#00ff00] border-opacity-30 hover:bg-[#00ff00] hover:text-black text-xs"
                  >
                    {sf.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Calculator Buttons */}
          <div className="p-4 bg-[#002200]">
            {buttons.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-2 mb-2">
                {row.map((btn) => (
                  <button
                    key={btn}
                    onClick={() => handleButtonClick(btn)}
                    className={`flex-1 py-3 text-lg font-bold border-2 border-[#00ff00] bg-black hover:bg-[#00ff00] hover:text-black transition-all shadow-[0_2px_10px_rgba(0,255,0,0.3)] ${
                      ['='].includes(btn) ? 'bg-[#00ff00] text-black text-2xl' : ''
                    } ${
                      ['C', 'CE'].includes(btn) ? 'bg-red-900 border-red-500 text-red-500 hover:bg-red-500 hover:text-black' : ''
                    }`}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="mt-6">
          <div className="text-lg mb-3 border-b border-[#00ff00] pb-2">
            [HISTORY]
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {history.length === 0 ? (
              <div className="text-center opacity-50 py-8">No calculations yet</div>
            ) : (
              history.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-3 border border-[#00ff00] border-opacity-30 bg-[#00ff00] bg-opacity-5 hover:bg-opacity-10 transition-all cursor-pointer"
                  onClick={() => setDisplay(item.expression)}
                >
                  <div className="text-sm opacity-70">{item.expression}</div>
                  <div className="text-xl font-bold">= {item.result}</div>
                  {item.latex && (
                    <div className="text-xs opacity-50 mt-1">LaTeX: {item.latex}</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Subliminal Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.056] z-0">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="goldenSpiral" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M 100 100 Q 100 50 150 50 T 150 150 T 50 150 T 50 50" 
                    stroke="#00ff00" fill="none" strokeWidth="1" opacity="0.8"/>
              <circle cx="100" cy="100" r="3" fill="#00ff00" opacity="0.5"/>
            </pattern>
            <pattern id="fibonacci" x="0" y="0" width="300" height="300" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="89" height="89" stroke="#00ff00" fill="none" strokeWidth="0.5" opacity="0.3"/>
              <rect x="89" y="0" width="55" height="55" stroke="#00ff00" fill="none" strokeWidth="0.5" opacity="0.3"/>
              <rect x="89" y="55" width="34" height="34" stroke="#00ff00" fill="none" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#goldenSpiral)" />
          <rect width="100%" height="100%" fill="url(#fibonacci)" opacity="0.5" />
        </svg>
      </div>
    </div>
  )
}

export default MainCalculator
