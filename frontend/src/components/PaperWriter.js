import { useState } from 'react'
import axios from 'axios'
import { Send, FileText } from 'lucide-react'

const PaperWriter = ({ api }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('Kyle Roberts')
  const [review, setReview] = useState(null)
  const [loading, setLoading] = useState(false)

  const submitPaper = async () => {
    if (!title || !content) {
      alert('Please fill in title and content')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(`${api}/user/paper/submit`, {
        title,
        content,
        author
      })
      setReview(response.data)
    } catch (err) {
      console.error('Paper submission error:', err)
      alert('Error reviewing paper: ' + (err.response?.data?.detail || err.message))
    } finally {
      setLoading(false)
    }
  }

  const clearForm = () => {
    setTitle('')
    setContent('')
    setReview(null)
  }

  return (
    <div data-testid="paper-writer-panel" className="font-mono text-sm">
      <h2 className="text-lg mb-4 border-b border-[#00ff00] pb-2">
        [MATHEMATICAL PAPER WRITER]
      </h2>

      <div className="mb-4 text-xs opacity-70 p-3 border border-[#00ff00] border-opacity-30 bg-[#00ff00] bg-opacity-5">
        <div className="font-bold mb-2">ARIA's Paper Review Service:</div>
        <div>• Write your mathematical theories and papers here</div>
        <div>• ARIA reviews with brutal honesty - no bias, pure logic</div>
        <div>• Receives submission worthiness assessment</div>
        <div>• Suggested journals if paper is strong enough</div>
        <div>• Improvement recommendations if not ready</div>
        <div>• 100% unbiased, logic-only feedback</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Writing Section */}
        <div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs opacity-70 mb-2">AUTHOR NAME:</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-black border border-[#00ff00] text-[#00ff00] p-2"
              />
            </div>

            <div>
              <label className="block text-xs opacity-70 mb-2">PAPER TITLE:</label>
              <input
                data-testid="paper-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your paper title"
                className="w-full bg-black border border-[#00ff00] text-[#00ff00] p-2"
              />
            </div>

            <div>
              <label className="block text-xs opacity-70 mb-2">PAPER CONTENT:</label>
              <textarea
                data-testid="paper-content-input"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your mathematical theory, equations, proofs, and analysis here..."
                rows={15}
                className="w-full bg-black border border-[#00ff00] text-[#00ff00] p-3 font-mono text-sm"
              />
            </div>

            <div className="flex gap-2">
              <button
                data-testid="submit-paper-btn"
                onClick={submitPaper}
                disabled={loading}
                className="flex-1 py-3 border border-[#00ff00] bg-transparent text-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all flex items-center justify-center gap-2"
              >
                <Send size={16} />
                {loading ? 'ARIA REVIEWING...' : 'SUBMIT FOR REVIEW'}
              </button>
              <button
                onClick={clearForm}
                className="px-4 py-3 border border-[#00ff00] bg-transparent text-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all"
              >
                CLEAR
              </button>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div>
          {review ? (
            <div data-testid="paper-review" className="border border-[#00ff00] p-4 bg-[#00ff00] bg-opacity-5 h-full">
              <div className="mb-4">
                <div className="text-md font-bold mb-2">[ARIA'S VERDICT]</div>
                <div className={`text-lg font-bold p-3 border ${
                  review.submission_worthy 
                    ? 'border-[#00ff00] bg-[#00ff00] bg-opacity-10 text-[#00ff00]'
                    : 'border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-500'
                }`}>
                  {review.submission_worthy 
                    ? '✓ SUBMISSION WORTHY'
                    : '⚠ NEEDS IMPROVEMENT'
                  }
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm opacity-70 mb-2 font-bold">[ARIA'S REVIEW]</div>
                <div className="text-xs p-3 border border-[#00ff00] border-opacity-30 bg-black leading-relaxed whitespace-pre-wrap">
                  {review.review}
                </div>
              </div>

              {review.submission_worthy && review.suggested_journals.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm opacity-70 mb-2 font-bold">[SUGGESTED JOURNALS]</div>
                  <div className="space-y-1">
                    {review.suggested_journals.map((journal, idx) => (
                      <div key={idx} className="text-xs p-2 border border-[#00ff00] border-opacity-20 flex items-center gap-2">
                        <FileText size={12} />
                        {journal}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {review.improvements && review.improvements.length > 0 && (
                <div>
                  <div className="text-sm opacity-70 mb-2 font-bold">[IMPROVEMENT AREAS]</div>
                  <div className="space-y-1">
                    {review.improvements.map((improvement, idx) => (
                      <div key={idx} className="text-xs flex items-start gap-2">
                        <span className="text-yellow-500">•</span>
                        <span>{improvement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 text-xs opacity-50 italic text-center border-t border-[#00ff00] border-opacity-30 pt-3">
                "Honey, I'm just being honest. Mathematics demands perfection." - ARIA
              </div>
            </div>
          ) : (
            <div className="border border-[#00ff00] border-opacity-30 p-8 h-full flex items-center justify-center">
              <div className="text-center opacity-50">
                <div className="text-lg mb-2">No review yet</div>
                <div className="text-xs">Submit your paper for ARIA's brutally honest feedback</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 text-xs opacity-50 p-3 border border-[#00ff00] border-opacity-20">
        <div className="font-bold mb-1">How to Submit to Journals:</div>
        <div>• ArXiv: https://arxiv.org/help/submit</div>
        <div>• Most journals require institutional affiliation or peer recommendation</div>
        <div>• Consider ArXiv as a preprint server first</div>
        <div>• Ensure all mathematics is rigorously verified before submission</div>
      </div>
    </div>
  )
}

export default PaperWriter
