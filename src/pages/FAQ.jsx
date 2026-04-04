import { useState, useRef, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { askGemini } from '../services/gemini'
import { Send, Bot, User, Sparkles } from 'lucide-react'

const FAQ_LIST = [
  { q: 'Apa itu Aksara Karya 62?', a: 'Aksara Karya 62 adalah komunitas prestasi mahasiswa IPB University yang bernaung di bawah Direktorat Kemahasiswaan. Komunitas ini berfokus pada pengembangan prestasi akademik dan non-akademik mahasiswa melalui 4 klaster: Desain, Olimpiade, Penulisan, dan Bisnis.' },
  { q: 'Bagaimana cara bergabung?', a: 'Bergabung dengan Aksara Karya 62 dilakukan melalui proses open recruitment yang dibuka setiap awal tahun akademik. Pantau informasi terbaru di Instagram resmi kami.' },
  { q: 'Apa saja klaster yang tersedia?', a: 'Terdapat 4 klaster: Desain (karya visual & kreatif), Olimpiade (kompetisi akademik), Penulisan (karya tulis & PKM), dan Bisnis (kewirausahaan & kompetisi bisnis).' },
  { q: 'Apa itu kabinet AKSARA KARYA?', a: 'AKSARA KARYA adalah nama kabinet kepengurusan Aksara Karya 62 periode ini. Kabinet ini terdiri dari BPH, dan divisi-divisi fungsional: HEG, CDA, MBD, dan KORVOKS.' },
  { q: 'Apa saja divisi fungsional?', a: 'HEG (Human Empowerment & Growth): mengurus anggota dan aktivitas. CDA (Competition & Development Achievement): mendampingi kompetisi. MBD (Media & Branding Division): konten dan media. KORVOKS (Koordinasi Vokasi & Konten): koordinasi lintas divisi.' },
  { q: 'Bagaimana sistem poin prestasi?', a: 'Setiap prestasi yang diunggah ke platform akan memberikan poin kepada anggota. Poin menentukan posisi di leaderboard. Level prestasi (Univ, Kota, Provinsi, Nasional, Internasional) mempengaruhi jumlah poin yang didapat.' },
]

const SUGGESTIONS = [
  'Apa keuntungan bergabung?',
  'Kompetisi apa yang tersedia?',
  'Bagaimana cara upload prestasi?',
  'Siapa saja pengurus HEG?',
]

export default function FAQPage() {
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Halo! Aku Aksara 👋, maskot komunitas Aksara Karya 62. Ada yang bisa aku bantu? Kamu bisa tanya seputar komunitas, klaster, kompetisi, atau hal lainnya!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('ai')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    const newMsgs = [...messages, { role: 'user', text: msg }]
    setMessages(newMsgs)
    setLoading(true)
    try {
      const reply = await askGemini(msg, messages.map(m => ({ role: m.role === 'model' ? 'model' : 'user', text: m.text })))
      setMessages([...newMsgs, { role: 'model', text: reply }])
    } catch {
      setMessages([...newMsgs, { role: 'model', text: 'Maaf, ada kendala teknis. Coba lagi ya!' }])
    }
    setLoading(false)
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68 }}>
        {/* Header */}
        <section style={{ padding: '4rem 0 2rem', background: 'linear-gradient(135deg, #F4F3EF, #FFFFFF)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Sparkles size={32} color="white" />
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.75rem' }}>FAQ & AI Asisten</h1>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: 480, margin: '0 auto' }}>
              Tanya Aksara — AI maskot komunitas kami — atau baca FAQ di bawah ini.
            </p>
            <div className="tabs" style={{ maxWidth: 320, margin: '2rem auto 0' }}>
              <button className={`tab${activeTab === 'ai' ? ' active' : ''}`} onClick={() => setActiveTab('ai')}>AI Chat</button>
              <button className={`tab${activeTab === 'faq' ? ' active' : ''}`} onClick={() => setActiveTab('faq')}>FAQ</button>
            </div>
          </div>
        </section>

        <section style={{ padding: '2rem 0 5rem' }}>
          <div className="container" style={{ maxWidth: 760 }}>

            {activeTab === 'ai' && (
              <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
                {/* Chat header */}
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--color-primary)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot size={20} color="white" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>Aksara</p>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>AI Maskot Aksara Karya 62</p>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Online</span>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ padding: '1.5rem', height: 400, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {messages.map((m, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                      {m.role === 'model' && (
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Bot size={16} color="white" />
                        </div>
                      )}
                      <div style={{
                        maxWidth: '75%', padding: '10px 14px', borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: m.role === 'user' ? 'var(--color-primary)' : 'var(--color-surface-2)',
                        color: m.role === 'user' ? 'white' : 'var(--color-text)',
                        fontSize: '0.875rem', lineHeight: 1.6,
                      }}>
                        {m.text}
                      </div>
                      {m.role === 'user' && (
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <User size={16} />
                        </div>
                      )}
                    </div>
                  ))}
                  {loading && (
                    <div style={{ display: 'flex', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Bot size={16} color="white" />
                      </div>
                      <div style={{ padding: '12px 16px', background: 'var(--color-surface-2)', borderRadius: '18px 18px 18px 4px' }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-text-muted)', animation: `bounce 1.2s ${i * 0.2}s infinite` }} />)}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick suggestions */}
                <div style={{ padding: '0 1.5rem', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => sendMessage(s)}
                      style={{ padding: '5px 12px', borderRadius: 20, border: '1px solid var(--color-border)', background: 'white', fontSize: '0.78rem', cursor: 'pointer', transition: 'var(--transition)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-pale)'; e.currentTarget.style.borderColor = 'var(--color-primary)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = 'var(--color-border)' }}>
                      {s}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: 10 }}>
                  <input value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Tulis pesan..."
                    className="form-input" style={{ flex: 1 }} />
                  <button onClick={() => sendMessage()} className="btn btn-primary" style={{ padding: '10px 14px' }} disabled={loading}>
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {FAQ_LIST.map((item, i) => (
                  <FAQItem key={i} q={item.q} a={item.a} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <style>{`
        @keyframes bounce { 0%,80%,100% { transform: translateY(0) } 40% { transform: translateY(-6px) } }
      `}</style>
    </>
  )
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '1rem',
      }}>
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{q}</span>
        <span style={{ transform: open ? 'rotate(45deg)' : 'none', transition: '0.2s', fontSize: '1.25rem', flexShrink: 0, color: 'var(--color-primary)' }}>+</span>
      </button>
      {open && (
        <div style={{ padding: '0 1.25rem 1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.7, borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
          {a}
        </div>
      )}
    </div>
  )
}
