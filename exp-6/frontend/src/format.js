export const number = (value) => new Intl.NumberFormat('en-IN').format(value)

export function ms(value) {
  if (value >= 1000) return `${(value / 1000).toFixed(2)} s`
  if (value >= 100) return `${Math.round(value)} ms`
  return `${value.toFixed(1)} ms`
}

export function date(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function time(iso) {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function percentile(sorted, p) {
  if (sorted.length === 0) return 0
  const index = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)
  return sorted[Math.max(0, index)]
}
