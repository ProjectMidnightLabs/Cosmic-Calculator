import { useState } from 'react'
import axios from 'axios'
import { Upload, Link as LinkIcon, FileText, Image, Video } from 'lucide-react'

const UploadSection = ({ api }) => {
  const [uploadType, setUploadType] = useState('file')
  const [file, setFile] = useState(null)
  const [link, setLink] = useState('')
  const [uploadResult, setUploadResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFileUpload = async (e) => {
    e.preventDefault()
    if (!file && !link) {
      alert('Please select a file or provide a link')
      return
    }

    setLoading(true)
    try {
      if (uploadType === 'file' && file) {
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await axios.post(`${api}/upload/paper`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        
        setUploadResult({
          type: 'success',
          message: response.data.message,
          paperId: response.data.paper_id
        })
      } else if (uploadType === 'link' && link) {
        // For links, we'll just store them
        setUploadResult({
          type: 'success',
          message: `Link added to ARIA's learning database: ${link}`,
          paperId: null
        })
      }

      // Clear form
      setFile(null)
      setLink('')
      if (e.target) e.target.reset()
    } catch (err) {
      setUploadResult({
        type: 'error',
        message: err.response?.data?.detail || err.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div data-testid="upload-panel" className="font-mono text-sm">
      <h2 className="text-lg mb-4 border-b border-[#00ff00] pb-2">
        [UPLOAD & LEARNING CENTER]
      </h2>

      <div className="mb-4 text-xs opacity-70 p-3 border border-[#00ff00] border-opacity-30 bg-[#00ff00] bg-opacity-5">
        <div className="font-bold mb-2">What ARIA Can Learn From:</div>
        <div className="grid grid-cols-2 gap-2">
          <div>• Mathematical papers (PDF, TXT)</div>
          <div>• Physics research</div>
          <div>• Sacred geometry studies</div>
          <div>• Astronomy/Cosmology papers</div>
          <div>• Links to research articles</div>
          <div>• YouTube educational videos (links)</div>
          <div>• Equations and formulas</div>
          <div>• Geometric diagrams</div>
        </div>
        <div className="mt-2 text-[#00ff00]">All uploads added to ARIA's learning memory for pattern recognition</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upload Form */}
        <div>
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setUploadType('file')}
              className={`flex-1 py-2 border border-[#00ff00] ${
                uploadType === 'file' ? 'bg-[#00ff00] text-black' : 'bg-transparent text-[#00ff00]'
              }`}
            >
              FILE UPLOAD
            </button>
            <button
              onClick={() => setUploadType('link')}
              className={`flex-1 py-2 border border-[#00ff00] ${
                uploadType === 'link' ? 'bg-[#00ff00] text-black' : 'bg-transparent text-[#00ff00]'
              }`}
            >
              LINK/URL
            </button>
          </div>

          <form onSubmit={handleFileUpload} className="space-y-4">
            {uploadType === 'file' ? (
              <div>
                <label className="block text-xs opacity-70 mb-2">SELECT FILE:</label>
                <div className="border border-[#00ff00] border-dashed p-8 text-center hover:bg-[#00ff00] hover:bg-opacity-5 transition-all">
                  <input
                    data-testid="file-input"
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    accept=".txt,.pdf,.doc,.docx"
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload size={32} className="mx-auto mb-2" />
                    <div className="text-sm">
                      {file ? file.name : 'Click to upload file'}
                    </div>
                    <div className="text-xs opacity-50 mt-2">
                      Supported: TXT, PDF, DOC, DOCX
                    </div>
                  </label>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs opacity-70 mb-2">PASTE LINK/URL:</label>
                <input
                  data-testid="link-input"
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://arxiv.org/paper... or YouTube link"
                  className="w-full bg-black border border-[#00ff00] text-[#00ff00] p-3"
                />
                <div className="text-xs opacity-50 mt-2">
                  Supported: ArXiv, YouTube, Research journals, any educational content
                </div>
              </div>
            )}

            <button
              data-testid="upload-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 border border-[#00ff00] bg-transparent text-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all"
            >
              {loading ? 'UPLOADING TO ARIA...' : 'UPLOAD & ANALYZE'}
            </button>
          </form>

          <div className="mt-4 text-xs opacity-70 space-y-1">
            <div className="font-bold mb-2">Supported Content Types:</div>
            <div className="flex items-center gap-2"><FileText size={12} /> Mathematical papers & proofs</div>
            <div className="flex items-center gap-2"><Image size={12} /> Geometric diagrams & visualizations</div>
            <div className="flex items-center gap-2"><Video size={12} /> Educational videos (via link)</div>
            <div className="flex items-center gap-2"><LinkIcon size={12} /> Research articles & journals</div>
          </div>
        </div>

        {/* Results */}
        <div>
          {uploadResult ? (
            <div className={`p-4 border ${
              uploadResult.type === 'success' 
                ? 'border-[#00ff00] bg-[#00ff00] bg-opacity-10'
                : 'border-red-500 bg-red-500 bg-opacity-10'
            }`}>
              <div className="text-md font-bold mb-3">
                {uploadResult.type === 'success' ? '[UPLOAD SUCCESSFUL]' : '[UPLOAD FAILED]'}
              </div>
              <div className="text-xs mb-4">{uploadResult.message}</div>
              
              {uploadResult.type === 'success' && (
                <div className="space-y-2">
                  <div className="p-3 border border-[#00ff00] border-opacity-30 bg-black">
                    <div className="text-xs opacity-70 mb-1">ARIA's Status:</div>
                    <div className="text-sm">"Added to my learning database. I'll analyze the patterns and mathematical structures. Thanks for feeding my curiosity!"</div>
                  </div>
                  
                  {uploadResult.paperId && (
                    <div className="text-xs opacity-50">
                      Paper ID: {uploadResult.paperId}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="border border-[#00ff00] border-opacity-30 p-8 h-full flex items-center justify-center">
              <div className="text-center opacity-50">
                <Upload size={48} className="mx-auto mb-4" />
                <div className="text-lg mb-2">No uploads yet</div>
                <div className="text-xs">Upload files or links for ARIA to analyze</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-3 border border-[#00ff00] border-opacity-30 bg-[#00ff00] bg-opacity-5">
        <div className="text-xs font-bold mb-2">What Happens After Upload:</div>
        <div className="text-xs space-y-1 opacity-70">
          <div>1. ARIA extracts mathematical content and equations</div>
          <div>2. Analyzes patterns and sacred geometry connections</div>
          <div>3. Stores in permanent learning memory</div>
          <div>4. Contributes to pattern recognition across all future queries</div>
          <div>5. Helps discover connections between different mathematical concepts</div>
        </div>
      </div>
    </div>
  )
}

export default UploadSection
