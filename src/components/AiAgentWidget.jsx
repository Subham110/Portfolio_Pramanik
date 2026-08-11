import { useEffect, useRef, useState } from 'react'
import { Bot, LoaderCircle, Send, Sparkles, X } from 'lucide-react'

const starterMessage = {
  role: 'assistant',
  text: 'Hi! I’m Subham’s profile assistant. Ask me about his work, skills, education, projects, or how to get in touch.',
}

const suggestions = ['Tell me about Subham', 'What are his projects?', 'How can I contact him?']

function endpoint() {
  if (import.meta.env.DEV) {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    return `${base}/api/ai-agent`
  }
  // Vercel sends both contact and agent requests through the existing /api function.
  return '/api'
}

export default function AiAgentWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([starterMessage])
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState('')
  const messagesRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    const node = messagesRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [messages, isStreaming])

  const ask = async (event, suggestedText) => {
    event?.preventDefault()
    const question = (suggestedText ?? input).trim()
    if (!question || isStreaming) return

    setInput('')
    setError('')
    setIsStreaming(true)
    setMessages(current => [...current, { role: 'user', text: question }, { role: 'assistant', text: '' }])

    try {
      const response = await fetch(endpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
        body: JSON.stringify({ type: 'ai-agent', message: question }),
      })
      if (!response.ok || !response.body) {
        let detail = 'The AI Agent is unavailable right now.'
        try {
          const payload = await response.json()
          detail = payload.detail || detail
        } catch { /* The response may be a plain-text platform error. */ }
        throw new Error(detail)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let finished = false
      const appendAssistantText = (text) => {
        if (!text) return
        setMessages(current => {
          const next = [...current]
          const last = next.length - 1
          next[last] = { ...next[last], text: `${next[last].text}${text}` }
          return next
        })
      }

      while (!finished) {
        const { value, done } = await reader.read()
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done })
        const events = buffer.split('\n\n')
        buffer = events.pop() || ''
        for (const eventText of events) {
          const dataLine = eventText.split('\n').find(line => line.startsWith('data:'))
          if (!dataLine) continue
          const payload = JSON.parse(dataLine.slice(5).trim())
          if (payload.error) throw new Error(payload.error)
          appendAssistantText(payload.text)
          if (payload.done) finished = true
        }
        if (done) finished = true
      }
    } catch (requestError) {
      setError(requestError.message || 'The AI Agent is unavailable right now.')
      setMessages(current => current.slice(0, -1))
    } finally {
      setIsStreaming(false)
    }
  }

  return <>
    <button
      type="button"
      className="ai-agent-launcher"
      aria-label={isOpen ? 'Close Subham profile AI Agent' : 'Open Subham profile AI Agent'}
      aria-expanded={isOpen}
      onClick={() => setIsOpen(current => !current)}
    >
      {isOpen ? <X size={23} /> : <Bot size={24} />}
      <span className="ai-agent-pulse" aria-hidden="true" />
    </button>

    {isOpen && <section className="ai-agent-panel" aria-label="Subham profile AI Agent">
      <header className="ai-agent-header">
        <div className="ai-agent-heading"><span className="ai-agent-icon"><Bot size={18} /></span><div><strong>Ask Subham’s AI Agent</strong><small><span /> Gemini · profile only</small></div></div>
        <button type="button" className="ai-agent-close" onClick={() => setIsOpen(false)} aria-label="Close AI Agent"><X size={18} /></button>
      </header>
      <div className="ai-agent-messages" ref={messagesRef} aria-live="polite">
        {messages.map((message, index) => <div className={`ai-agent-message ${message.role}`} key={`${message.role}-${index}`}>
          {message.role === 'assistant' && <span className="message-avatar"><Sparkles size={13} /></span>}
          <p>{message.text || (isStreaming && index === messages.length - 1 ? 'Thinking…' : '')}</p>
        </div>)}
        {error && <p className="ai-agent-error">{error}</p>}
      </div>
      {messages.length === 1 && <div className="ai-agent-suggestions">{suggestions.map(suggestion => <button type="button" key={suggestion} onClick={event => ask(event, suggestion)}>{suggestion}</button>)}</div>}
      <form className="ai-agent-form" onSubmit={ask}>
        <input ref={inputRef} value={input} onChange={event => setInput(event.target.value)} placeholder="Ask about Subham…" aria-label="Ask about Subham" disabled={isStreaming} />
        <button type="submit" aria-label="Send question" disabled={!input.trim() || isStreaming}>{isStreaming ? <LoaderCircle className="spin" size={18} /> : <Send size={18} />}</button>
      </form>
      <p className="ai-agent-note">Answers are limited to Subham’s portfolio.</p>
    </section>}
  </>
}
