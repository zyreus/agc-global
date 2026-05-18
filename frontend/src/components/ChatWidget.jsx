import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { API_BASE_URL } from '../lib/config.js'

const STORAGE_KEY = 'agc_chat_widget_state_v2'

const QUICK_OPTIONS = [
  { id: 'ask', label: 'Ask a Question', icon: '💬' },
  { id: 'services', label: 'Our Services', icon: '🏢' },
  { id: 'track', label: 'Track Order / Service', icon: '📦' },
  { id: 'report', label: 'Report a Problem', icon: '⚠️' },
  { id: 'faq', label: 'View FAQ', icon: '📋' },
  { id: 'feedback', label: 'Customer Feedback', icon: '⭐' },
  { id: 'agent', label: 'Talk to Representative', icon: '👤' },
]

const FAQ_ITEMS = [
  {
    id: 'services',
    q: 'What services does AGC provide?',
    a: 'AGC provides software development, IT solutions, business automation, security, maintenance, and system integration services.',
  },
  {
    id: 'timeline',
    q: 'How long do AGC projects usually take?',
    a: 'Timelines depend on scope, but most projects begin with discovery and planning, followed by phased delivery and support.',
  },
  {
    id: 'pricing',
    q: 'How can I get a quote?',
    a: 'Share your project requirements and AGC can prepare a tailored quotation based on features, timeline, and support needs.',
  },
]

const formatTime = (d) => {
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function getConvoId() {
  let id = sessionStorage.getItem('agc_convo_id')
  if (!id) {
    id = (crypto?.randomUUID?.() ?? String(Date.now()) + Math.random().toString(16).slice(2))
    sessionStorage.setItem('agc_convo_id', id)
  }
  return id
}

function ChatIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M8 10h8M8 14h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 12c0 4.418-3.582 8-8 8-1.151 0-2.245-.243-3.234-.68L4 20l.86-3.766A7.963 7.963 0 0 1 4 12c0-4.418 3.582-8 8-8s8 3.582 8 8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SendIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M6 12L3.27 3.13A59.7 59.7 0 0 1 21.49 12 59.7 59.7 0 0 1 3.27 20.87L6 12Zm0 0h7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ChatWidget() {
  const convoId = useRef(getConvoId())
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  const initial = useMemo(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      if (!parsed || typeof parsed !== 'object') return null
      return parsed
    } catch {
      return null
    }
  }, [])

  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const [mode, setMode] = useState(initial?.mode ?? 'greeting')
  const [messages, setMessages] = useState(Array.isArray(initial?.messages) ? initial.messages : [])
  const [agentForm, setAgentForm] = useState({ name: '', email: '', concern: '' })
  const [feedbackForm, setFeedbackForm] = useState({ rating: 0, name: '', email: '', comment: '' })
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [agentStep, setAgentStep] = useState(null)
  const [faqFeedback, setFaqFeedback] = useState(null)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const lastServerCountRef = useRef(0)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, mode }))
    } catch {
      // ignore storage failures
    }
  }, [messages, mode])

  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener('agc:open-chat', onOpen)
    return () => window.removeEventListener('agc:open-chat', onOpen)
  }, [])

  useEffect(() => {
    if (!open) return
    startTransition(() => setUnread(0))
    window.setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  // Poll server messages so Human/Admin replies appear for visitors (no websockets).
  useEffect(() => {
    if (!open) return
    let cancelled = false

    const mapServer = (serverMsgs) =>
      (serverMsgs || []).map((m) => ({
        sender: m.role === 'user' ? 'user' : m.role === 'admin' ? 'admin' : 'ai',
        content: m.message,
        time: m.created_at,
      }))

    const tick = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/chat/messages/${convoId.current}`, { cache: 'no-store' })
        const data = await response.json().catch(() => ({}))
        const serverMsgs = data.messages ?? []
        if (cancelled) return
        if (Array.isArray(serverMsgs) && serverMsgs.length >= lastServerCountRef.current) {
          lastServerCountRef.current = serverMsgs.length
          setMessages(mapServer(serverMsgs))
          if (mode === 'greeting' && serverMsgs.length > 0) setMode('chat')
        }
      } catch {
        // ignore
      }
    }

    tick()
    const id = setInterval(tick, 2500)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [open, mode])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing, mode, agentStep, faqFeedback])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const addLocal = useCallback((sender, content, extras = {}) => {
    setMessages((prev) => [...prev, { sender, content, time: new Date().toISOString(), ...extras }])
  }, [])

  const resetChat = useCallback(() => {
    const newId = (crypto?.randomUUID?.() ?? String(Date.now()) + Math.random().toString(16).slice(2))
    sessionStorage.setItem('agc_convo_id', newId)
    convoId.current = newId
    setMessages([])
    setMode('greeting')
    setAgentStep(null)
    setFaqFeedback(null)
    setFeedbackForm({ rating: 0, name: '', email: '', comment: '' })
    setFeedbackSubmitted(false)
    setAgentForm({ name: '', email: '', concern: '' })
  }, [])

  const sendToAi = useCallback(async (text) => {
    setTyping(true)
    try {
      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, session_id: convoId.current }),
      })

      if (!response.ok) throw new Error('Request failed')
      const result = await response.json()
      addLocal('ai', result.reply ?? 'No response received.')
      if (!open) setUnread((n) => n + 1)
    } catch {
      addLocal('ai', 'Sorry — I’m having trouble right now. Please try again in a moment.')
    } finally {
      setTyping(false)
    }
  }, [addLocal, open])

  const handleQuickOption = useCallback((opt) => {
    addLocal('user', opt.label)
    if (opt.id === 'agent') {
      addLocal('ai', 'Would you like to connect with a live representative?')
      setMode('agent')
      setAgentStep('confirm')
      return
    }
    if (opt.id === 'services') {
      addLocal('ai', 'AGC offers IT solutions, software development, business solutions, and security/maintenance. What do you need help with?')
      setMode('chat')
      return
    }
    if (opt.id === 'faq') {
      addLocal('ai', 'Here are some frequently asked questions:')
      setMode('faq')
      return
    }
    if (opt.id === 'feedback') {
      addLocal('ai', "We'd love to hear your feedback! Please fill out the form below.")
      setMode('feedback')
      setFeedbackSubmitted(false)
      setFeedbackForm({ rating: 0, name: '', email: '', comment: '' })
      return
    }
    const prompts = {
      ask: "Sure! Go ahead and type your question — I'm here to help.",
      track: 'Please provide your reference number or describe your request.',
      report: "I'm sorry to hear that. Please describe the problem.",
    }
    addLocal('ai', prompts[opt.id] ?? "Sure! Go ahead and type your question — I'm here to help.")
    setMode('chat')
  }, [addLocal])

  const handleFaqSelect = useCallback((faq) => {
    addLocal('user', faq.q)
    addLocal('ai', faq.a)
    setFaqFeedback('pending')
  }, [addLocal])

  const handleFaqFeedback = useCallback((helpful) => {
    setFaqFeedback(null)
    if (helpful) {
      addLocal('user', 'Yes 👍')
      addLocal('ai', "Glad I could help! Anything else you'd like to know?")
      setMode('faq')
      return
    }
    addLocal('user', 'No, I need more help')
    addLocal('ai', 'Would you like to chat with a representative?')
    setMode('agent')
    setAgentStep('confirm')
  }, [addLocal])

  const handleAgentConfirm = useCallback((yes) => {
    if (yes) {
      addLocal('user', 'Yes, connect me')
      addLocal('ai', 'Please fill in your details below so we can connect you.')
      setAgentStep('form')
      return
    }
    addLocal('user', 'No, go back')
    addLocal('ai', 'No problem! Feel free to browse FAQs or ask me anything.')
    setMode('faq')
    setAgentStep(null)
  }, [addLocal])

  const handleAgentSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (!agentForm.name || !agentForm.email || !agentForm.concern) return
    addLocal('user', `Name: ${agentForm.name}\nEmail: ${agentForm.email}\nConcern: ${agentForm.concern}`)
    setAgentStep(null)
    setMode('chat')
    setAgentForm({ name: '', email: '', concern: '' })
    try {
      await fetch(`${API_BASE_URL}/chat/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: convoId.current,
          name: agentForm.name,
          email: agentForm.email,
          concern: agentForm.concern,
        }),
      })
    } catch {
      // ignore
    }
    await sendToAi(`Agent request:\nName: ${agentForm.name}\nEmail: ${agentForm.email}\nConcern: ${agentForm.concern}`)
  }, [agentForm, addLocal, sendToAi])

  const handleFeedbackSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (!feedbackForm.rating || !feedbackForm.name.trim() || !feedbackForm.email.trim() || !feedbackForm.comment.trim()) return
    const stars = '★'.repeat(feedbackForm.rating) + '☆'.repeat(5 - feedbackForm.rating)
    addLocal('user', `${stars}\nName: ${feedbackForm.name}\nEmail: ${feedbackForm.email}\nFeedback: ${feedbackForm.comment}`)
    try {
      await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: convoId.current,
          rating: feedbackForm.rating,
          name: feedbackForm.name,
          email: feedbackForm.email,
          comment: feedbackForm.comment,
        }),
      })
    } catch {
      // ignore
    }
    addLocal('ai', 'Thank you for your feedback! Is there anything else I can help you with?')
    setFeedbackSubmitted(true)
    setFeedbackForm({ rating: 0, name: '', email: '', comment: '' })
    setMode('chat')
  }, [feedbackForm, addLocal])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text) return
    if (mode === 'greeting') setMode('chat')
    addLocal('user', text)
    setInput('')
    await sendToAi(text)
  }, [input, mode, addLocal, sendToAi])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary text-white shadow-lg transition-transform hover:scale-105 active:scale-95 sm:bottom-6 sm:right-6"
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <ChatIcon className="h-6 w-6" />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </>
        )}
      </button>

      {open && (
        <div className="fixed bottom-[max(4.75rem,env(safe-area-inset-bottom))] left-2 right-2 z-50 flex h-[min(560px,calc(100dvh-6rem))] w-auto max-w-none flex-col overflow-hidden rounded-2xl border border-brand-primary/30 bg-white shadow-2xl sm:bottom-24 sm:left-auto sm:right-6 sm:w-[min(380px,calc(100vw-3rem))]">
          <div className="flex items-center gap-2 border-b border-brand-primary/30 bg-brand-primary px-3 py-3">
            {mode !== 'greeting' && (
              <button
                type="button"
                onClick={resetChat}
                className="rounded-md p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
                title="Back to menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
            )}
            <img src="/AGC.png" alt="" className="h-9 w-9 rounded-full bg-white/20 object-cover object-[0%_50%] p-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">AGC Assistant</p>
              <p className="text-xs text-white/70">Technology &amp; Business Support</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
              {mode !== 'greeting' && (
                <button
                  type="button"
                  onClick={resetChat}
                  className="rounded-md p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
                  title="New conversation"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {mode === 'greeting' && messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <img src="/AGC.png" alt="" className="h-16 w-16 rounded-full object-cover object-[0%_50%]" />
                <div>
                  <p className="text-base font-semibold text-[#3A3F45]">Welcome to AGC!</p>
                  <p className="mt-1 text-sm text-[#3A3F45]/80">How can we help you today?</p>
                </div>
                <div className="mt-2 flex w-full flex-col gap-2">
                  {QUICK_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleQuickOption(opt)}
                      className="flex w-full items-center gap-3 rounded-xl border border-[#C9CED4]/40 bg-[#F4F6F8]/60 px-4 py-3 text-left text-sm font-medium text-[#3A3F45] transition hover:border-brand-primary/40 hover:bg-brand-primary/5"
                    >
                      <span className="text-lg">{opt.icon}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(mode !== 'greeting' || messages.length > 0) && (
              <div className="space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`relative max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'rounded-br-md bg-brand-primary text-white'
                          : 'rounded-bl-md border border-[#C9CED4]/30 bg-[#F4F6F8] text-[#3A3F45]'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <p className={`mt-1 text-right text-[10px] ${msg.sender === 'user' ? 'text-white/60' : 'text-[#3A3F45]/40'}`}>
                        {formatTime(msg.time)}
                      </p>
                    </div>
                  </div>
                ))}

                {mode === 'faq' && !faqFeedback && (
                  <div className="flex flex-col gap-1.5">
                    {FAQ_ITEMS.map((faq) => (
                      <button
                        key={faq.id}
                        type="button"
                        onClick={() => handleFaqSelect(faq)}
                        className="w-full rounded-xl border border-[#C9CED4]/40 bg-[#F4F6F8]/60 px-4 py-2.5 text-left text-sm text-[#3A3F45] transition hover:border-brand-primary/40 hover:bg-brand-primary/5"
                      >
                        {faq.q}
                      </button>
                    ))}
                  </div>
                )}

                {faqFeedback === 'pending' && (
                  <div className="flex flex-col items-start gap-2">
                    <p className="rounded-2xl rounded-bl-md border border-[#C9CED4]/30 bg-[#F4F6F8] px-4 py-2.5 text-sm text-[#3A3F45]">
                      Did this answer your question?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => handleFaqFeedback(true)} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600">
                        Yes 👍
                      </button>
                      <button type="button" onClick={() => handleFaqFeedback(false)} className="rounded-xl border border-[#C9CED4]/50 px-4 py-2 text-sm font-medium text-[#3A3F45] transition hover:bg-[#F4F6F8]">
                        No, I need more help
                      </button>
                    </div>
                  </div>
                )}

                {agentStep === 'confirm' && (
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => handleAgentConfirm(true)} className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-primary-hover">
                      Yes, connect me
                    </button>
                    <button type="button" onClick={() => handleAgentConfirm(false)} className="rounded-xl border border-[#C9CED4]/50 px-4 py-2 text-sm font-medium text-[#3A3F45] transition hover:bg-[#F4F6F8]">
                      No, go back
                    </button>
                  </div>
                )}

                {agentStep === 'form' && (
                  <form onSubmit={handleAgentSubmit} className="w-full max-w-full space-y-2.5 rounded-2xl rounded-bl-md border border-[#C9CED4]/30 bg-[#F4F6F8] p-4 sm:max-w-[90%]">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={agentForm.name}
                      onChange={(e) => setAgentForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full rounded-lg border border-[#C9CED4]/50 bg-white px-3 py-2 text-sm text-[#3A3F45] outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Your email"
                      value={agentForm.email}
                      onChange={(e) => setAgentForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full rounded-lg border border-[#C9CED4]/50 bg-white px-3 py-2 text-sm text-[#3A3F45] outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20"
                      required
                    />
                    <textarea
                      rows={2}
                      placeholder="Describe your concern"
                      value={agentForm.concern}
                      onChange={(e) => setAgentForm((f) => ({ ...f, concern: e.target.value }))}
                      className="w-full resize-none rounded-lg border border-[#C9CED4]/50 bg-white px-3 py-2 text-sm text-[#3A3F45] outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20"
                      required
                    />
                    <button type="submit" className="w-full rounded-lg bg-brand-primary py-2 text-sm font-semibold text-white transition hover:bg-brand-primary-hover">
                      Submit &amp; Connect
                    </button>
                  </form>
                )}

                {mode === 'feedback' && !feedbackSubmitted && (
                  <form onSubmit={handleFeedbackSubmit} className="w-full max-w-full space-y-3 rounded-2xl rounded-bl-md border border-[#C9CED4]/30 bg-[#F4F6F8] p-4 sm:max-w-[90%]">
                    <div>
                      <p className="mb-2 text-xs font-semibold text-[#3A3F45]/70">How would you rate your experience?</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFeedbackForm((f) => ({ ...f, rating: star }))}
                            className={`text-2xl transition-transform hover:scale-110 ${feedbackForm.rating >= star ? 'text-amber-400' : 'text-gray-300'}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={feedbackForm.name}
                      onChange={(e) => setFeedbackForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full rounded-lg border border-[#C9CED4]/50 bg-white px-3 py-2 text-sm text-[#3A3F45] outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Your email"
                      value={feedbackForm.email}
                      onChange={(e) => setFeedbackForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full rounded-lg border border-[#C9CED4]/50 bg-white px-3 py-2 text-sm text-[#3A3F45] outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20"
                      required
                    />
                    <textarea
                      rows={3}
                      placeholder="Tell us about your experience..."
                      value={feedbackForm.comment}
                      onChange={(e) => setFeedbackForm((f) => ({ ...f, comment: e.target.value }))}
                      className="w-full resize-none rounded-lg border border-[#C9CED4]/50 bg-white px-3 py-2 text-sm text-[#3A3F45] outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20"
                      required
                    />
                    <button type="submit" disabled={!feedbackForm.rating} className="w-full rounded-lg bg-brand-primary py-2 text-sm font-semibold text-white transition hover:bg-brand-primary-hover disabled:opacity-40">
                      Submit Feedback
                    </button>
                  </form>
                )}

                {typing && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-[#C9CED4]/30 bg-[#F4F6F8] px-4 py-3">
                      <span className="h-2 w-2 rounded-full bg-brand-primary/60" />
                      <span className="h-2 w-2 rounded-full bg-brand-primary/60" />
                      <span className="h-2 w-2 rounded-full bg-brand-primary/60" />
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            )}
          </div>

          <div className="border-t border-[#C9CED4]/30 bg-white px-3 py-3">
            <div className="flex items-end gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 rounded-xl border border-[#C9CED4]/50 bg-[#F4F6F8]/60 px-4 py-2.5 text-sm text-[#3A3F45] outline-none transition placeholder:text-[#3A3F45]/50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={!input.trim() || typing}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary text-white transition hover:bg-brand-primary-hover disabled:opacity-40"
                aria-label="Send"
              >
                <SendIcon className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-[#3A3F45]/40">Powered by AI · Responses may not always be accurate</p>
          </div>
        </div>
      )}
    </>
  )
}

