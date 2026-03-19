import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Menu, Copy, Save, Volume2, PenTool } from 'lucide-react'
import SideMenu from './SideMenu'
import DrawingPad from './DrawingPad'
import AuthGate from './AuthGate'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const API = `${BACKEND_URL}/api`

const MainCalculator = () => {
  const [display, setDisplay] = useState('')
  const [history, setHistory] = useState([])
  const [savedFormulas, setSavedFormulas] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(true) // Start as authenticated
  const [playingSound, setPlayingSound] = useState(false)
  const [drawingPadOpen, setDrawingPadOpen] = useState(false)
  const audioContextRef = useRef(null)

  useEffect(() => {
    // Load saved formulas from localStorage
    const saved = localStorage.getItem('savedFormulas')
    if (saved) {
      setSavedFormulas(JSON.parse(saved))
    }
    // Load history
    const hist = localStorage.getItem('calcHistory')
    if (hist) {
      setHistory(JSON.parse(hist))
    }
  }, [])

  const handleButtonClick = (value) => {
    if (value === '=') {
      calculate()
    } else if (value === 'C') {
      setDisplay('')
    } else if (value === 'CE') {
      setDisplay(display.slice(0, -1))
    } else if (value === 'paste') {
      navigator.clipboard.readText().then(text => {
        setDisplay(display + text)
      })
    } else {
      setDisplay(display + value)
    }
  }

  const calculate = async () => {
    if (!display) return

    try {
      const response = await axios.post(`${API}/calculator`, { expression: display })
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
    // Convert drawing to base64 and send to ARIA for analysis
    console.log('Drawing saved:', drawingDataUrl)
    // Future: Send to backend for OCR/analysis
  }

  const playGoldenRatioSound = () => {
    if (playingSound) return
    
    setPlayingSound(true)
    const phi = 1.618033988749895
    const baseFreq = 432 // Hz (natural frequency)
    
    // Create audio context
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    audioContextRef.current = audioCtx
    
    // Create oscillators for golden ratio harmonics
    const oscillator1 = audioCtx.createOscillator()
    const oscillator2 = audioCtx.createOscillator()
    const oscillator3 = audioCtx.createOscillator()
    
    const gainNode = audioCtx.createGain()
    gainNode.gain.value = 0.1
    
    oscillator1.frequency.value = baseFreq
    oscillator2.frequency.value = baseFreq * phi
    oscillator3.frequency.value = baseFreq / phi
    
    oscillator1.type = 'sine'
    oscillator2.type = 'sine'
    oscillator3.type = 'sine'
    
    oscillator1.connect(gainNode)
    oscillator2.connect(gainNode)
    oscillator3.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    
    oscillator1.start()
    oscillator2.start()
    oscillator3.start()
    
    // Stop after 3 seconds
    setTimeout(() => {
      oscillator1.stop()
      oscillator2.stop()
      oscillator3.stop()
      setPlayingSound(false)
    }, 3000)
  }

  const buttons = [
    ['7', '8', '9', '÷', 'C'],
    ['4', '5', '6', '×', 'CE'],
    ['1', '2', '3', '-', '√'],
    ['0', '.', '=', '+', 'π'],
    ['sin(', 'cos(', 'tan(', '^', 'φ'],
    ['(', ')', 'log(', 'e', '!'],
  ]

  const convertDisplay = (disp) => {
    return disp
      .replace(/÷/g, '/')
      .replace(/×/g, '*')
      .replace(/π/g, 'pi')
      .replace(/φ/g, '(1+sqrt(5))/2')
      .replace(/√/g, 'sqrt(')
      .replace(/\^/g, '**')
      .replace(/!/g, 'factorial(')
  }

  if (!isAuthenticated) {
    return <AuthGate api={API} onAuthSuccess={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="min-h-screen bg-black text-[#00ff00] relative">
      {/* Hidden auth signature in code */}
      <div style={{display: 'none'}}>PM-KR-2026-NSW Kyle Roberts Nowra</div>
      
      {/* Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed top-4 left-4 z-50 p-3 border border-[#00ff00] bg-black hover:bg-[#00ff00] hover:text-black transition-all"
        data-testid="menu-button"
      >
        <Menu size={24} />
      </button>

      {/* Golden Ratio Sound Button */}
      <button
        onClick={playGoldenRatioSound}
        disabled={playingSound}
        className={`fixed top-4 right-4 z-50 p-3 border border-[#00ff00] bg-black hover:bg-[#00ff00] hover:text-black transition-all ${
          playingSound ? 'animate-pulse' : ''
        }`}
        title="Play Golden Ratio Frequency (φ harmonics)"
      >
        <Volume2 size={24} />
      </button>

      {/* Side Menu */}
      <SideMenu 
        isOpen={menuOpen} 
        onClose={() => setMenuOpen(false)}
        api={API}
      />

      {/* Drawing Pad */}
      <DrawingPad
        isOpen={drawingPadOpen}
        onClose={() => setDrawingPadOpen(false)}
        onSave={handleDrawingSave}
      />


      {/* Calculator Container */}
      <div className="max-w-2xl mx-auto p-4 pt-20">
        {/* ARIA Suggestion Box */}
        <div className="mb-4 p-3 border border-[#00ff00] border-opacity-30 bg-[#00ff00] bg-opacity-5 text-xs">
          <div className="font-bold mb-1">ARIA's Mathematical Calculator</div>
          <div className="opacity-70">Try: Golden ratio φ = (1+√5)/2, Euler's e, π calculations, trigonometry, logarithms</div>
        </div>

        {/* Calculator Display */}
        <div className="border-4 border-[#00ff00] bg-black shadow-[0_0_20px_#00ff00]">
          {/* Display Screen */}
          <div className="bg-[#001100] p-6 border-b-4 border-[#00ff00]">
            <div className="text-right font-mono">
              <div className="text-sm opacity-50 mb-2 h-6">
                {history[0] && `Last: ${history[0].expression} = ${history[0].result}`}
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

          {/* Saved Formulas Quick Access */}
          {savedFormulas.length > 0 && (
            <div className="p-3 border-b-2 border-[#00ff00] border-opacity-30 bg-[#001100]">
              <div className="text-xs opacity-70 mb-2">SAVED FORMULAS:</div>
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

          {/* Calculator Buttons - Old School Style */}
          <div className="p-4 bg-[#002200]">
            {buttons.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-2 mb-2">
                {row.map((btn) => (
                  <button
                    key={btn}
                    onClick={() => handleButtonClick(btn)}
                    className={`flex-1 py-4 text-xl font-bold border-2 border-[#00ff00] bg-black hover:bg-[#00ff00] hover:text-black transition-all shadow-[0_2px_10px_rgba(0,255,0,0.3)] ${
                      ['='].includes(btn) ? 'bg-[#00ff00] text-black' : ''
                    } ${
                      ['C', 'CE'].includes(btn) ? 'bg-red-900 border-red-500 text-red-500 hover:bg-red-500 hover:text-black' : ''
                    }`}
                    data-testid={`calc-btn-${btn}`}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

          {/* Drawing Pad Button */}
          <div className="p-4 border-t-2 border-[#00ff00]">
            <button
              onClick={() => setDrawingPadOpen(true)}
              className="w-full py-4 text-lg font-bold border-2 border-[#00ff00] bg-black hover:bg-[#00ff00] hover:text-black transition-all flex items-center justify-center gap-2"
            >
              <PenTool size={24} />
              DRAWING PAD
            </button>
            <div className="text-xs opacity-50 text-center mt-2">
              Switch to freehand mode - draw equations and diagrams
            </div>
          </div>


        {/* History Section - Scrollable */}
        <div className="mt-6">
          <div className="text-lg mb-3 border-b border-[#00ff00] pb-2">
            [CALCULATION_HISTORY]
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {history.length === 0 ? (
              <div className="text-center opacity-50 py-8">No calculations yet</div>
            ) : (
              history.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-3 border border-[#00ff00] border-opacity-30 bg-[#00ff00] bg-opacity-5 hover:bg-opacity-10 transition-all"
                  onClick={() => setDisplay(item.expression)}
                  style={{cursor: 'pointer'}}
                >
                  <div className="text-sm opacity-70">{item.expression}</div>
                  <div className="text-xl font-bold">= {item.result}</div>
                  {item.latex && (
                    <div className="text-xs opacity-50 mt-1">LaTeX: {item.latex}</div>
                  )}
                  <div className="text-xs opacity-30 mt-1">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Sensual Mathematical Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="goldenSpiral" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M 100 100 Q 100 50 150 50 T 150 150 T 50 150 T 50 50" 
                    stroke="#00ff00" fill="none" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#goldenSpiral)" />
        </svg>
      </div>
    </div>
  )
}

export default MainCalculator
