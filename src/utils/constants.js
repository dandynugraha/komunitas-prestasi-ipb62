export const BASE = import.meta.env.BASE_URL
export const LOGO = `${BASE}logo.png`

export const CL = {
  bisnis:    { color: '#5C3BC4', bg: '#EEE8FF', label: 'Bisnis & Analisis' },
  desain:    { color: '#D94F1E', bg: '#FFECE5', label: 'Desain & Visual'   },
  penulisan: { color: '#148060', bg: '#E5F5EF', label: 'Penulisan & Sains' },
}
export const getCL = (k) => CL[k?.toLowerCase()] || { color:'#5C3BC4', bg:'#EEE8FF', label: k||'—' }

export const LV = {
  internasional: 'lbadge lb-int',
  nasional:      'lbadge lb-nas',
  provinsi:      'lbadge lb-pro',
  kota:          'lbadge lb-kot',
  universitas:   'lbadge lb-univ',
}
export const getLV = (l) => LV[l?.toLowerCase()] || 'lbadge lb-univ'
