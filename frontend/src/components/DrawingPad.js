import { useState, useRef, useEffect } from 'react'
import { X, Eraser, Download, Upload } from 'lucide-react'

const DrawingPad = ({ isOpen, onClose, onSave }) => {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#00ff00')
  const [lineWidth, setLineWidth] = useState(2)

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }, [isOpen])

  const startDrawing = (e) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
  }

  const draw = (e) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const saveDrawing = () => {
    const canvas = canvasRef.current
    const dataUrl = canvas.toDataURL('image/png')
    onSave(dataUrl)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
      <div className="bg-black border-2 border-[#00ff00] max-w-4xl w-full">
        <div className="p-4 border-b border-[#00ff00] flex items-center justify-between">
          <div className="font-bold">DRAWING PAD - Freehand Mathematics</div>
          <button onClick={onClose} className="p-2 hover:bg-[#00ff00] hover:text-black">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {/* Tools */}
          <div className="flex gap-4 mb-4 items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setColor('#00ff00')}
                className={`w-8 h-8 border-2 ${
                  color === '#00ff00' ? 'border-white' : 'border-[#00ff00]'
                }`}
                style={{backgroundColor: '#00ff00'}}
              />
              <button
                onClick={() => setColor('#ffffff')}
                className={`w-8 h-8 border-2 ${
                  color === '#ffffff' ? 'border-[#00ff00]' : 'border-[#00ff00]'
                }`}
                style={{backgroundColor: '#ffffff'}}
              />
              <button
                onClick={() => setColor('#ff0000')}
                className={`w-8 h-8 border-2 ${
                  color === '#ff0000' ? 'border-white' : 'border-[#00ff00]'
                }`}
                style={{backgroundColor: '#ff0000'}}
              />
            </div>

            <select
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="bg-black border border-[#00ff00] text-[#00ff00] p-2"
            >
              <option value="1">Thin</option>
              <option value="2">Normal</option>
              <option value="4">Thick</option>
              <option value="8">Very Thick</option>
            </select>

            <button
              onClick={clearCanvas}
              className="px-4 py-2 border border-[#00ff00] hover:bg-[#00ff00] hover:text-black flex items-center gap-2"
            >
              <Eraser size={16} />
              Clear
            </button>

            <button
              onClick={saveDrawing}
              className="px-4 py-2 border border-[#00ff00] bg-[#00ff00] text-black hover:bg-transparent hover:text-[#00ff00] flex items-center gap-2"
            >
              <Download size={16} />
              Save Drawing
            </button>
          </div>

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="border-2 border-[#00ff00] cursor-crosshair w-full"
            style={{touchAction: 'none'}}
          />

          <div className="text-xs opacity-50 mt-2">
            Draw mathematical equations, diagrams, or geometric patterns. ARIA will analyze your drawing.
          </div>
        </div>
      </div>
    </div>
  )
}

export default DrawingPad
