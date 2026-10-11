import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LuX,
  LuSend,
  LuSparkles,
  LuCopy,
  LuCheck,
  LuTrash2,
  LuRefreshCw,
  LuBot,
  LuUser
} from 'react-icons/lu'
import { HiSparkles } from 'react-icons/hi2'
import { api } from '../../services/api'

const PLATFORMS = ['All Platforms', 'Instagram', 'LinkedIn', 'Twitter (X)', 'YouTube']

const INITIAL_SUGGESTIONS = [
  '🔥 3 viral hook formulas for LinkedIn',
  '📈 How do I increase my Instagram carousel reach?',
  '✍️ Rewrite this caption to trigger high curiosity',
  '⏰ What are the best posting times this week?',
  '🏷️ Give me 10 high-growth tech & AI hashtags'
]

export default function AIAssistantModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `👋 **Welcome to SocialOpti AI!**\n\nI’m your dedicated social media growth strategist powered by **Google Gemini**. Ask me anything about:\n\n• **Viral Hooks & Openers** that stop the scroll\n• **Caption Polishing & Tone Optimization**\n• **High-Traffic Hashtag Strategies**\n• **Platform-Specific Best Practices** (Instagram, LinkedIn, X, YouTube)\n\n*Choose a suggested prompt below or type your question!*`,
      model: 'gemini-3.5-flash',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [input, setInput] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('All Platforms')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen])

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading, isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `Chat history cleared. How can I help you grow your audience today?`,
        model: 'gemini-3.5-flash',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ])
  }

  const handleSend = async (customMessage) => {
    const textToSend = (customMessage || input).trim()
    if (!textToSend || isLoading) return

    const userMessageId = `user-${Date.now()}`
    const newMessages = [
      ...messages,
      {
        id: userMessageId,
        role: 'user',
        content: textToSend,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]

    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      // Build conversation history for context (exclude welcome message)
      const historyPayload = newMessages
        .filter((m) => m.id !== 'welcome' && m.id !== 'welcome-reset')
        .map((m) => ({
          role: m.role,
          content: m.content
        }))

      const response = await api.chatWithAssistant({
        message: textToSend,
        history: historyPayload,
        platform: selectedPlatform === 'All Platforms' ? 'all' : selectedPlatform.toLowerCase()
      })

      if (response && response.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: response.reply,
            model: response.model || 'gemini-3.5-flash',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ])

        if (response.suggestions && response.suggestions.length > 0) {
          setSuggestions(response.suggestions)
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Sorry, I encountered an issue contacting the Gemini model. Please try again or check your backend connection.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Format markdown helper for clean rendering of bold, bullet points, headers
  const renderFormattedContent = (content) => {
    const lines = content.split('\n')
    return (
      <div className="space-y-2 text-xs leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) {
            return <div key={idx} className="h-1.5" />
          }
          // Header 3 / 2
          if (line.startsWith('### ') || line.startsWith('## ')) {
            const headingText = line.replace(/^#{2,3}\s+/, '')
            return (
              <h4 key={idx} className="font-bold text-sm text-ink-900 dark:text-white mt-2 pt-1 border-t border-ink-100 dark:border-ink-800 first:border-none first:pt-0">
                {headingText}
              </h4>
            )
          }
          // Bullet points
          if (line.startsWith('• ') || line.startsWith('* ') || line.startsWith('- ')) {
            const bulletText = line.replace(/^[-*•]\s+/, '')
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-[#633DF2] font-bold text-sm leading-none mt-0.5">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(bulletText) }} />
              </div>
            )
          }
          // Numbered lists
          const numMatch = line.match(/^(\d+)\.\s+(.*)/)
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="font-bold text-[#633DF2] shrink-0 text-xs">{numMatch[1]}.</span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(numMatch[2]) }} />
              </div>
            )
          }
          // Normal line
          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
          )
        })}
      </div>
    )
  }

  const formatInlineMarkdown = (text) => {
    return text
      // Bold **text**
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic *text*
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code `code`
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-[#633DF2] font-mono text-[11px]">$1</code>')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-ink-900/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl h-[85vh] max-h-[720px] bg-white dark:bg-ink-900 rounded-3xl shadow-2xl border border-ink-100 dark:border-ink-800 flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-ink-100 dark:border-ink-800 flex items-center justify-between bg-gradient-to-r from-purple-50/70 via-white to-white dark:from-ink-800/60 dark:via-ink-900 dark:to-ink-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#633DF2] to-[#8C6BFF] flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                <HiSparkles className="text-xl" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-sm sm:text-base text-ink-900 dark:text-white">
                    SocialOpti AI Assistant
                  </h3>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Gemini Live
                  </span>
                </div>
                <p className="text-[11px] text-ink-400 font-medium">
                  Intelligent social media copy, hooks & algorithmic optimization
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClearHistory}
                title="Clear conversation"
                className="w-8 h-8 rounded-xl flex items-center justify-center text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-800 transition"
              >
                <LuTrash2 className="text-sm" />
              </button>
              <button
                onClick={onClose}
                title="Close Assistant"
                className="w-8 h-8 rounded-xl flex items-center justify-center text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-800 transition"
              >
                <LuX className="text-base" />
              </button>
            </div>
          </div>

          {/* Platform Filter Bar */}
          <div className="px-5 py-2.5 bg-ink-50/50 dark:bg-ink-800/40 border-b border-ink-100 dark:border-ink-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-semibold text-ink-400 mr-1 shrink-0">Focus:</span>
            {PLATFORMS.map((plat) => (
              <button
                key={plat}
                onClick={() => setSelectedPlatform(plat)}
                className={`text-[11px] font-medium px-3 py-1 rounded-lg shrink-0 transition ${
                  selectedPlatform === plat
                    ? 'bg-[#633DF2] text-white shadow-sm'
                    : 'bg-white dark:bg-ink-800 text-ink-600 dark:text-ink-300 border border-ink-100 dark:border-ink-700 hover:border-[#633DF2]/30'
                }`}
              >
                {plat}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === 'user'
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl shrink-0 flex items-center justify-center text-xs ${
                      isUser
                        ? 'bg-[#633DF2] text-white'
                        : 'bg-[#F4F1FF] dark:bg-ink-800 text-[#633DF2] border border-[#E0D7FE] dark:border-ink-700'
                    }`}
                  >
                    {isUser ? <LuUser /> : <LuBot />}
                  </div>

                  <div className={`max-w-[85%] sm:max-w-[80%] group ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-3.5 rounded-2xl ${
                        isUser
                          ? 'bg-[#633DF2] text-white rounded-tr-sm shadow-sm'
                          : 'bg-[#F9FAFD] dark:bg-ink-800/80 text-ink-800 dark:text-ink-100 border border-ink-100 dark:border-ink-700 rounded-tl-sm'
                      }`}
                    >
                      {isUser ? (
                        <p className="text-xs whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      ) : (
                        renderFormattedContent(msg.content)
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1 px-1">
                      <span className="text-[10px] text-ink-400 font-medium">{msg.timestamp}</span>
                      {!isUser && (
                        <>
                          {msg.model && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-ink-100 dark:bg-ink-800 text-ink-400 font-mono">
                              {msg.model}
                            </span>
                          )}
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            title="Copy reply"
                            className="opacity-0 group-hover:opacity-100 transition text-[10px] text-ink-400 hover:text-[#633DF2] flex items-center gap-1"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <LuCheck className="text-emerald-500" /> Copied
                              </>
                            ) : (
                              <>
                                <LuCopy /> Copy
                              </>
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-xl shrink-0 flex items-center justify-center text-xs bg-[#F4F1FF] dark:bg-ink-800 text-[#633DF2] border border-[#E0D7FE] dark:border-ink-700">
                  <LuBot />
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F9FAFD] dark:bg-ink-800/80 border border-ink-100 dark:border-ink-700 rounded-tl-sm flex items-center gap-2">
                  <span className="text-xs text-ink-500 dark:text-ink-400 font-medium">
                    SocialOpti AI is thinking
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#633DF2] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#633DF2] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#633DF2] animate-bounce" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          {suggestions && suggestions.length > 0 && !isLoading && (
            <div className="px-5 py-2 bg-white dark:bg-ink-900 border-t border-ink-100/70 dark:border-ink-800/70">
              <p className="text-[10px] font-bold text-ink-400 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                <LuSparkles className="text-[#633DF2]" /> Quick Suggestions
              </p>
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(sug)}
                    className="text-[11px] px-3 py-1.5 rounded-xl bg-[#F4F1FF] dark:bg-ink-800 text-[#633DF2] dark:text-primary-300 hover:bg-[#E0D7FE] dark:hover:bg-ink-700 transition font-medium shrink-0 border border-[#E0D7FE]/60 dark:border-ink-700"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <div className="p-4 border-t border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex items-center gap-2 bg-[#F7F8FC] dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-2xl px-3.5 py-2 focus-within:border-[#633DF2] focus-within:ring-2 focus-within:ring-[#633DF2]/15 transition"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask SocialOpti AI for hooks, captions, tips, or viral strategies..."
                className="flex-1 bg-transparent text-xs text-ink-800 dark:text-ink-100 placeholder:text-ink-400 focus:outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-8 h-8 rounded-xl bg-[#633DF2] hover:bg-[#522DE0] disabled:opacity-40 text-white flex items-center justify-center transition shadow-sm"
              >
                <LuSend className="text-xs" />
              </button>
            </form>
            <div className="flex items-center justify-between mt-1.5 px-1">
              <span className="text-[10px] text-ink-400">
                Press <kbd className="px-1 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-[9px] font-mono">Enter</kbd> to send
              </span>
              <span className="text-[10px] text-ink-400">
                Powered by Google Gemini 3.5
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
