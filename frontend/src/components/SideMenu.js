import { useState } from 'react'
import { X, Calculator as CalcIcon, FileText, BookOpen, Lightbulb, MessageSquare, Upload, PenTool, FolderOpen } from 'lucide-react'
import ScanStatus from './ScanStatus'
import EquationsList from './EquationsList'
import PapersList from './PapersList'
import TheoryExplorer from './TheoryExplorer'
import ChatInterface from './ChatInterface'
import PaperWriter from './PaperWriter'
import UploadSection from './UploadSection'
import DocumentOrganizer from './DocumentOrganizer'

const SideMenu = ({ isOpen, onClose, api }) => {
  const [activeSection, setActiveSection] = useState(null)
  const [scanStatus, setScanStatus] = useState(null)

  const menuItems = [
    { id: 'calculator', label: 'Calculator', icon: CalcIcon, action: onClose },
    { id: 'status', label: 'System Status', icon: Lightbulb, component: ScanStatus },
    { id: 'equations', label: 'Equations', icon: FileText, component: EquationsList },
    { id: 'papers', label: 'Papers', icon: BookOpen, component: PapersList },
    { id: 'theories', label: 'Theories', icon: Lightbulb, component: TheoryExplorer },
    { id: 'chat', label: 'ARIA AI', icon: MessageSquare, component: ChatInterface },
    { id: 'writer', label: 'Paper Writer', icon: PenTool, component: PaperWriter },
    { id: 'upload', label: 'Upload', icon: Upload, component: UploadSection },
    { id: 'documents', label: 'Doc Organizer', icon: FolderOpen, component: DocumentOrganizer },
  ]

  const handleMenuClick = (item) => {
    if (item.id === 'calculator') {
      setActiveSection(null)
      onClose()
    } else {
      setActiveSection(item.id)
    }
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-40"
          onClick={onClose}
        />
      )}

      {/* Side Menu */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-black border-r-2 border-[#00ff00] z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 border-b border-[#00ff00] flex items-center justify-between">
          <div className="font-bold text-lg">ARIA MENU</div>
          <button onClick={onClose} className="p-2 hover:bg-[#00ff00] hover:text-black">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-60px)]">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item)}
                className={`w-full p-4 border-b border-[#00ff00] border-opacity-30 flex items-center gap-3 hover:bg-[#00ff00] hover:text-black transition-all ${
                  activeSection === item.id ? 'bg-[#00ff00] text-black' : ''
                }`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content Panel */}
      {activeSection && (
        <div className="fixed inset-0 bg-black z-45 overflow-y-auto pt-20 px-4">
          <button
            onClick={() => setActiveSection(null)}
            className="fixed top-4 right-4 p-3 border border-[#00ff00] hover:bg-[#00ff00] hover:text-black z-50"
          >
            <X size={24} />
          </button>

          <div className="max-w-6xl mx-auto pb-20">
            {activeSection === 'status' && <ScanStatus api={api} scanStatus={scanStatus} onRefresh={() => {}} />}
            {activeSection === 'equations' && <EquationsList api={api} />}
            {activeSection === 'papers' && <PapersList api={api} />}
            {activeSection === 'theories' && <TheoryExplorer api={api} />}
            {activeSection === 'chat' && <ChatInterface api={api} />}
            {activeSection === 'writer' && <PaperWriter api={api} />}
            {activeSection === 'upload' && <UploadSection api={api} />}
            {activeSection === 'documents' && <DocumentOrganizer api={api} />}
          </div>
        </div>
      )}
    </>
  )
}

export default SideMenu
