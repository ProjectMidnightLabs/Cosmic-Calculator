import { useState } from 'react'
import axios from 'axios'
import { Upload, FolderOpen, FileText, Sparkles, ChevronRight } from 'lucide-react'

const DocumentOrganizer = ({ api }) => {
  const [documents, setDocuments] = useState([])
  const [expandStack, setExpandStack] = useState([])
  const [organizing, setOrganizing] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [emailPermission, setEmailPermission] = useState(false)

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setOrganizing(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await axios.post(`${api}/upload/paper`, formData)
      
      // Simulate document organization
      const newDoc = {
        id: response.data.paper_id || Date.now().toString(),
        name: file.name,
        type: file.type,
        sections: [
          { title: 'Introduction', content: 'Auto-organized content...' },
          { title: 'Methodology', content: 'Mathematical approaches...' },
          { title: 'Results', content: 'Key findings...' },
        ],
        glossary: ['Term 1', 'Term 2', 'Term 3'],
        expandable: ['Concept A', 'Concept B', 'Concept C']
      }
      
      setDocuments([newDoc, ...documents])
    } catch (err) {
      console.error('Upload error:', err)
    } finally {
      setOrganizing(false)
    }
  }

  const addToExpandStack = (item, docId) => {
    const newStack = [...expandStack, { item, docId, timestamp: new Date() }].slice(0, 10)
    setExpandStack(newStack)
  }

  const saveEmailPermission = () => {
    if (userEmail && emailPermission) {
      localStorage.setItem('userEmail', userEmail)
      localStorage.setItem('emailPermission', 'true')
      alert('Email permission saved! ARIA can now send on your behalf when you make breakthroughs.')
    }
  }

  return (
    <div data-testid="doc-organizer-panel" className="font-mono text-sm">
      <h2 className="text-lg mb-4 border-b border-[#00ff00] pb-2">
        [DOCUMENT_ORGANIZER_&_EXPAND_IDEAS]
      </h2>

      {/* Email Permission Section */}
      <div className="mb-6 p-4 border border-[#00ff00] bg-[#00ff00] bg-opacity-5">
        <div className="text-sm font-bold mb-3">Email Permission (Optional)</div>
        <div className="text-xs opacity-70 mb-3">
          Give ARIA permission to send emails on your behalf when you make mathematical breakthroughs.
          She'll always ask first!
        </div>
        <div className="space-y-2">
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="w-full bg-black border border-[#00ff00] text-[#00ff00] p-2 text-sm"
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={emailPermission}
              onChange={(e) => setEmailPermission(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-xs">I give ARIA permission to send emails on my behalf (she'll always ask first)</span>
          </label>
          <button
            onClick={saveEmailPermission}
            disabled={!userEmail || !emailPermission}
            className="w-full py-2 border border-[#00ff00] hover:bg-[#00ff00] hover:text-black disabled:opacity-30"
          >
            Save Permission
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Upload Section */}
        <div className="lg:col-span-2">
          <div className="border border-[#00ff00] p-4 mb-4">
            <div className="text-sm font-bold mb-3">Upload Documents</div>
            <label className="border-2 border-dashed border-[#00ff00] p-8 block text-center cursor-pointer hover:bg-[#00ff00] hover:bg-opacity-5">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
              />
              <Upload size={32} className="mx-auto mb-2" />
              <div>Click to upload Excel, Word, PDF, TXT</div>
              <div className="text-xs opacity-50 mt-2">
                ARIA will auto-organize, create glossaries, and find expandable ideas
              </div>
            </label>
          </div>

          {/* Documents List */}
          {organizing && (
            <div className="text-center py-8">
              <Sparkles size={32} className="mx-auto mb-2 animate-spin" />
              <div>ARIA organizing your document...</div>
            </div>
          )}

          {documents.map((doc) => (
            <div key={doc.id} className="border border-[#00ff00] p-4 mb-4 bg-[#00ff00] bg-opacity-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={20} />
                <div className="font-bold">{doc.name}</div>
              </div>

              <div className="text-xs space-y-3">
                <div>
                  <div className="opacity-70 mb-1">Auto-organized Sections:</div>
                  {doc.sections.map((section, idx) => (
                    <div key={idx} className="ml-4 mb-1">
                      • {section.title}
                    </div>
                  ))}
                </div>

                <div>
                  <div className="opacity-70 mb-1">Generated Glossary:</div>
                  <div className="flex gap-2 flex-wrap ml-4">
                    {doc.glossary.map((term, idx) => (
                      <span key={idx} className="px-2 py-1 border border-[#00ff00] border-opacity-30">
                        {term}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="opacity-70 mb-1">Expandable Ideas:</div>
                  <div className="space-y-1 ml-4">
                    {doc.expandable.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => addToExpandStack(item, doc.id)}
                        className="flex items-center gap-2 text-xs px-2 py-1 border border-[#00ff00] border-opacity-30 hover:bg-[#00ff00] hover:text-black w-full"
                      >
                        <ChevronRight size={12} />
                        {item}
                        <Sparkles size={12} className="ml-auto" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {documents.length === 0 && !organizing && (
            <div className="text-center py-12 opacity-50">
              <FolderOpen size={48} className="mx-auto mb-4" />
              <div>No documents yet</div>
              <div className="text-xs mt-2">Upload docs for ARIA to organize and analyze</div>
            </div>
          )}
        </div>

        {/* Expand Stack */}
        <div>
          <div className="border border-[#00ff00] p-4 sticky top-4">
            <div className="text-sm font-bold mb-3">Expand Stack (Max 10)</div>
            <div className="text-xs opacity-70 mb-3">
              Ideas queued for ARIA to expand on. Overflow goes to experiments.
            </div>

            {expandStack.length === 0 ? (
              <div className="text-center py-8 opacity-50 text-xs">
                No ideas in stack yet
              </div>
            ) : (
              <div className="space-y-2">
                {expandStack.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 border border-[#00ff00] border-opacity-30 bg-black text-xs"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#00ff00]">#{idx + 1}</span>
                      <Sparkles size={12} />
                    </div>
                    <div>{item.item}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 text-xs opacity-50">
              Stack: {expandStack.length}/10
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentOrganizer
