import { useState } from 'react'
import axios from 'axios'
import { Copy } from 'lucide-react'

const Calculator = ({ api }) => {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('')
  const [latex, setLatex] = useState('')
  const [history, setHistory] = useState([])
  const [error, setError] = useState('')

  const calculate = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      const response = await axios.post(`${api}/calculator`, { expression })
      setResult(response.data.result)
      setLatex(response.data.latex)
      setHistory(prev => [{
        expression: response.data.expression,
        result: response.data.result,
        latex: response.data.latex,
        timestamp: new Date().toISOString()
      }, ...prev].slice(0, 10))
    } catch (err) {
      setError(err.response?.data?.detail || 'Calculation error')
    }
  }

  const insertFunction = (func) => {
    setExpression(prev => prev + func)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const functions = [
    { label: '√', value: 'sqrt(' },
    { label: 'sin', value: 'sin(' },
    { label: 'cos', value: 'cos(' },
    { label: 'tan', value: 'tan(' },
    { label: 'asin', value: 'asin(' },
    { label: 'acos', value: 'acos(' },
    { label: 'atan', value: 'atan(' },
    { label: 'log', value: 'log(' },
    { label: 'log10', value: 'log10(' },
    { label: 'exp', value: 'exp(' },
    { label: 'π', value: 'pi' },
    { label: 'e', value: 'e' },
    { label: 'φ', value: '(1+sqrt(5))/2' },
    { label: 'x²', value: '**2' },
    { label: 'xⁿ', value: '**' },
    { label: 'abs', value: 'abs(' },
    { label: 'x!', value: 'factorial(' },
    { label: '(', value: '(' },
    { label: ')', value: ')' },
    { label: 'sinh', value: 'sinh(' },
    { label: 'cosh', value: 'cosh(' },
    { label: 'tanh', value: 'tanh(' },
    { label: 'gcd', value: 'gcd(' },
    { label: 'lcm', value: 'lcm(' }
  ]

  return (
    <div data-testid="calculator-panel" className="font-mono text-sm">
      <h2 className="text-lg mb-4 border-b border-[#00ff00] pb-2">
        [SCIENTIFIC_CALCULATOR]
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Calculator Input */}
        <div>
          <form onSubmit={calculate} className="space-y-4">
            <div>
              <label className="block text-xs opacity-70 mb-2">
                EXPRESSION:
              </label>
              <input
                data-testid="calc-expression-input"
                type="text"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="e.g., sqrt(25) + sin(pi/2)"
                className="w-full bg-black border border-[#00ff00] text-[#00ff00] p-3 text-lg"
              />
            </div>

            {/* Function Buttons */}
            <div className="grid grid-cols-6 gap-2">
              {functions.map((func) => (
                <button
                  key={func.label}
                  type="button"
                  data-testid={`func-${func.label}`}
                  onClick={() => insertFunction(func.value)}
                  className="p-2 border border-[#00ff00] border-opacity-50 hover:border-opacity-100 hover:bg-[#00ff00] hover:text-black text-xs"
                >
                  {func.label}
                </button>
              ))}
            </div>

            <button
              data-testid="calc-submit-btn"
              type="submit"
              className="w-full py-3 border border-[#00ff00] bg-transparent text-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all"
            >
              [CALCULATE]
            </button>
          </form>

          {result && (
            <div data-testid="calc-result" className="mt-4 p-4 border border-[#00ff00] bg-[#00ff00] bg-opacity-10">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs opacity-70">RESULT:</div>
                <button
                  onClick={() => copyToClipboard(result)}
                  className="text-xs px-2 py-1 border border-[#00ff00] hover:bg-[#00ff00] hover:text-black flex items-center gap-1"
                >
                  <Copy size={12} />
                  COPY
                </button>
              </div>
              <div className="text-2xl font-bold">{result}</div>
              {latex && (
                <div className="mt-2 text-xs opacity-70 border-t border-[#00ff00] border-opacity-30 pt-2">
                  LaTeX: {latex}
                  <button
                    onClick={() => copyToClipboard(latex)}
                    className="ml-2 text-xs underline hover:text-[#00ff00]"
                  >
                    copy
                  </button>
                </div>
              )}
            </div>
          )}

          {error && (
            <div data-testid="calc-error" className="mt-4 p-3 border border-red-500 text-red-500 text-xs">
              [ERROR] {error}
            </div>
          )}

          <div className="mt-4 text-xs opacity-50 space-y-1">
            <div>AVAILABLE FUNCTIONS:</div>
            <div>sqrt, sin, cos, tan, asin, acos, atan</div>
            <div>sinh, cosh, tanh, log, log10, exp</div>
            <div>factorial, gcd, lcm, abs, pow</div>
            <div>CONSTANTS: pi, e</div>
          </div>
        </div>

        {/* History */}
        <div>
          <h3 className="text-md mb-3 border-b border-[#00ff00] border-opacity-30 pb-2">
            [CALCULATION_HISTORY]
          </h3>
          {history.length === 0 ? (
            <div className="text-center opacity-50 mt-8">
              No calculations yet
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item, idx) => (
                <div 
                  key={idx}
                  data-testid={`history-${idx}`}
                  className="p-2 border border-[#00ff00] border-opacity-20"
                >
                  <div className="text-xs opacity-70">{item.expression}</div>
                  <div className="text-lg">= {item.result}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Calculator
