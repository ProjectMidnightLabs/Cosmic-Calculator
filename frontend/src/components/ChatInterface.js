import { useState } from 'react'
import axios from 'axios'

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

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: userQuery }])

    try {
      const response = await axios.post(`${api}/chat`, { query: userQuery })
      
      // Add AI response
      setMessages(prev => [...prev, {
        type: 'ai',
        content: response.data.response,
        possibilities: response.data.possibilities_considered,
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

  return (
    <div data-testid="chat-panel" className="font-mono text-sm">
      <h2 className="text-lg mb-4 border-b border-[#00ff00] pb-2">
        [AI_QUERY_INTERFACE]
      </h2>

      <div className="mb-4 text-xs opacity-70 p-3 border border-[#00ff00] border-opacity-30">
        <div>CAPABILITIES:</div>
        <div>• Pure mathematical reasoning (no personality)</div>
        <div>• Sacred geometry analysis</div>
        <div>• Multi-possibility consideration (2-6 approaches)</div>
        <div>• Unconventional problem solving</div>
      </div>

      <div className="border border-[#00ff00] border-opacity-30 p-4 h-96 overflow-y-auto mb-4">
        {messages.length === 0 ? (
          <div className="text-center opacity-50 mt-20">
            No queries yet. Ask any mathematical question.
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} data-testid={`message-${idx}`}>
                {msg.type === 'user' && (
                  <div className="text-right">
                    <div className="inline-block bg-[#00ff00] text-black p-2 max-w-[80%]">
                      [USER] {msg.content}
                    </div>
                  </div>
                )}
                
                {msg.type === 'ai' && (
                  <div>
                    <div className="border border-[#00ff00] border-opacity-50 p-3 max-w-[90%]">
                      <div className="text-xs opacity-50 mb-2">[AI_RESPONSE]</div>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      
                      {msg.possibilities && msg.possibilities.length > 0 && (
                        <div className="mt-3 text-xs">
                          <div className="opacity-50 mb-1">[POSSIBILITIES_CONSIDERED]</div>
                          {msg.possibilities.map((p, i) => (
                            <div key={i} className="opacity-70">• {p}</div>
                          ))}
                        </div>
                      )}
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
          placeholder="Enter mathematical query..."
          className="flex-1 bg-black border border-[#00ff00] text-[#00ff00] p-2"
          disabled={loading}
        />
        <button
          data-testid="chat-submit-btn"
          type="submit"
          disabled={loading}
          className="px-6 border border-[#00ff00] bg-transparent text-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all"
        >
          {loading ? '[...]' : '[QUERY]'}
        </button>
      </form>
    </div>
  )
}

export default ChatInterface
