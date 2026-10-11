import { createContext, useContext, useState } from 'react'
import AIAssistantModal from '../components/ui/AIAssistantModal'

const AssistantContext = createContext({
  isAssistantOpen: false,
  openAssistant: () => {},
  closeAssistant: () => {},
  toggleAssistant: () => {}
})

export function AssistantProvider({ children }) {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false)

  const openAssistant = () => setIsAssistantOpen(true)
  const closeAssistant = () => setIsAssistantOpen(false)
  const toggleAssistant = () => setIsAssistantOpen((prev) => !prev)

  return (
    <AssistantContext.Provider value={{ isAssistantOpen, openAssistant, closeAssistant, toggleAssistant }}>
      {children}
      <AIAssistantModal isOpen={isAssistantOpen} onClose={closeAssistant} />
    </AssistantContext.Provider>
  )
}

export function useAssistant() {
  const context = useContext(AssistantContext)
  if (!context) {
    return {
      isAssistantOpen: false,
      openAssistant: () => {},
      closeAssistant: () => {},
      toggleAssistant: () => {}
    }
  }
  return context
}
