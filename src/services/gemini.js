const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`

const SYSTEM_CONTEXT = `
Kamu adalah Aksara, maskot resmi komunitas Aksara Karya 62 dari IPB University.
Kamu ramah, profesional, dan antusias tentang prestasi akademik dan non-akademik.
Komunitas ini terdiri dari 4 klaster: Desain, Olimpiade, Penulisan, dan Bisnis.
Divisi fungsional: HEG (Human Empowerment & Growth), CDA (Competition & Development Achievement), MBD (Media & Branding Division), KORVOKS (Koordinasi Vokasi & Konten).
Kabinet tahun ini bernama AKSARA KARYA.
Jawab pertanyaan seputar komunitas, kompetisi, kegiatan, dan prestasi dengan nada hangat tapi profesional.
Jika ditanya hal di luar komunitas, tetap jawab secara umum dengan baik.
Gunakan Bahasa Indonesia yang baik dan natural.
`

export const askGemini = async (userMessage, history = []) => {
  const contents = [
    ...history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    })),
    {
      role: 'user',
      parts: [{ text: userMessage }]
    }
  ]

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: SYSTEM_CONTEXT }]
      },
      contents,
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 1024,
      }
    })
  })

  if (!response.ok) throw new Error('Gemini API error')
  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Maaf, aku tidak bisa menjawab saat ini.'
}
