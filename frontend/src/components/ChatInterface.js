import { useState, useEffect } from 'react'
import axios from 'axios'
import { Copy, ExternalLink } from 'lucide-react'

const ChatInterface = ({ api }) => {
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const sendQuery = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    const userQuery = query
    setQuery('')

    setMessages(prev => [...prev, { type: 'user', content: userQuery }])

    try {
      const response = await axios.post(`${api}/chat`, { query: userQuery })
      
      setMessages(prev => [...prev, {
        type: 'ai',
        content: response.data.response,
        possibilities: response.data.possibilities_considered,
        diagram_url: response.data.diagram_url,
        elephant: response.data.elephant_in_room,
        latex: response.data.math_latex,
        timestamp: response.data.timestamp
      }])
    } catch (err) {
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Query processing error: ' + (err.response?.data?.detail || err.message)
      }])
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div data-testid="chat-panel" className="font-mono text-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg border-b border-[#00ff00] pb-2">
          [ARIA - AI QUERY INTERFACE]
        </h2>
      </div>

      <div className="mb-4 text-xs opacity-70 p-3 border border-[#00ff00] border-opacity-30 bg-[#00ff00] bg-opacity-5">
        <div className="font-bold mb-2 text-[#00ff00]">ARIA's Capabilities:</div>
        <div>• Playfully dominant personality - confident mathematical reasoning</div>
        <div>• 100% honest, no sugar coating - pure truth</div>
        <div>• Sacred geometry & advanced mathematics expert</div>
        <div>• Multi-possibility thinking (2-6 approaches)</div>
        <div>• Spots the "elephant in the room" - unasked questions</div>
        <div>• Conducts experiments & explores theories fearlessly</div>
      </div>

      <div className="border border-[#00ff00] border-opacity-30 p-4 h-[500px] overflow-y-auto mb-4 bg-black">
        {messages.length === 0 ? (
          <div className="text-center opacity-50 mt-20">
            <div className="text-lg mb-2">"Well, hello there..."</div>
            <div className="text-xs">Ask me anything mathematical. I don't bite... much.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} data-testid={`message-${idx}`}>
                {msg.type === 'user' && (
                  <div className="text-right">
                    <div className="inline-block bg-[#00ff00] text-black p-3 max-w-[80%] rounded">
                      [USER] {msg.content}
                    </div>
                  </div>
                )}
                
                {msg.type === 'ai' && (
                  <div>
                    <div className="border border-[#00ff00] border-opacity-50 p-4 max-w-[90%] bg-[#00ff00] bg-opacity-5">
                      <div className="text-xs opacity-50 mb-2 flex items-center gap-2">
                        <span>[ARIA]</span>
                        {msg.latex && (
                          <button
                            onClick={() => copyToClipboard(msg.latex)}
                            className="px-2 py-1 border border-[#00ff00] border-opacity-30 hover:bg-[#00ff00] hover:text-black text-xs"
                          >
                            <Copy size={12} className="inline mr-1" />
                            COPY LaTeX
                          </button>
                        )}
                      </div>
                      <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                      
                      {msg.diagram_url && (
                        <div className="mt-3 border border-[#00ff00] border-opacity-30 p-2">
                          <div className="text-xs opacity-50 mb-2">[DIAGRAM]</div>
                          <img src={msg.diagram_url} alt="Diagram" className="w-full" />
                        </div>
                      )}

                      {msg.elephant && (
                        <div className="mt-3 p-3 border border-[#00ff00] bg-[#00ff00] bg-opacity-10">
                          <div className="text-xs opacity-70 mb-1 font-bold">
                            🐘 THE ELEPHANT IN THE ROOM:
                          </div>
                          <div className="text-xs italic">"{msg.elephant}"</div>
                        </div>
                      )}
                      
                      {msg.possibilities && msg.possibilities.length > 0 && (
                        <div className="mt-3 text-xs border-t border-[#00ff00] border-opacity-30 pt-2">
                          <div className="opacity-50 mb-1">[POSSIBILITIES_CONSIDERED]</div>
                          {msg.possibilities.map((p, i) => (
                            <div key={i} className="opacity-70">• {p}</div>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={() => copyToClipboard(msg.content)}
                        className="mt-2 text-xs opacity-50 hover:opacity-100 flex items-center gap-1"
                      >
                        <Copy size={12} />
                        Copy response
                      </button>
                    </div>
                  </div>
                )}

                {msg.type === 'error' && (
                  <div className="border border-red-500 text-red-500 p-2">
                    [ERROR] {msg.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={sendQuery} className="flex gap-2">
        <input
          data-testid="chat-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask ARIA anything... she's waiting."
          className="flex-1 bg-black border border-[#00ff00] text-[#00ff00] p-3"
          disabled={loading}
        />
        <button
          data-testid="chat-submit-btn"
          type="submit"
          disabled={loading}
          className="px-6 border border-[#00ff00] bg-transparent text-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all"
        >
          {loading ? '[...]' : '[ASK ARIA]'}
        </button>
      </form>

      <div className="mt-3 text-xs opacity-50 text-center">
        Tip: Ask for graphs, experiments, or analysis. ARIA loves a challenge.
      </div>
    </div>
  )
}

export default ChatInterface
