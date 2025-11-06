// src/components/Terms.jsx
// *** 這是步驟 17 的「置頂搜尋框」版本 ***

import { API_BASE } from '../api'
import { useEffect, useMemo, useState } from 'react'

export function Terms ({ onPickTerm }) {
  const [terms, setTerms] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    let alive = true
    const ac = new AbortController()
    const load = async () => {
      setLoading(true)
      setErr('')
      try {
        const res = await fetch(`${API_BASE}/terms`, { signal: ac.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (!alive) return
        setTerms(Array.isArray(data?.terms) ? data.terms : [])
      } catch (e) {
        if (!alive) return
        setErr(`Failed to fetch terms: ${e?.message || e}`)
      } finally {
        if (alive) setLoading(false)
      }
    }
    load()
    return () => { alive = false; ac.abort() }
  }, [])

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase()
    if (!s) return terms
    return terms.filter(t => t.toLowerCase().includes(s))
  }, [terms, search])

  return (
    // *** 1. 修改：讓 .terms 容器成為 flex-column ***
    <div className='terms' style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* *** 2. 修改：讓 .terms__controls 
           (A) 不壓縮 (flexShrink: 0)
           (B) 成為「置頂」元素 (position: sticky)
           (C) 加上和卡片一樣的背景色，才不會透明
      */}
      <div 
        className='terms__controls' 
        style={{ 
          flexShrink: 0, 
          position: 'sticky', 
          top: 0, 
          background: '#AADFC8', // 必須和卡片背景色一致
          paddingBottom: '12px',  // 增加和列表的間距
          zIndex: 10              // 確保它在最上層
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search terms…'
          className='input'
        />
        <button
          onClick={() => setSearch('')}
          className='btn btn--primary'
        >
          Clear
        </button>
      </div>

      {loading && (
        <div className='terms__skeleton'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='terms__skeleton-row' />
          ))}
        </div>
      )}

      {err && (
        <div className='alert alert--error'>
          {err}
        </div>
      )}

      {/* *** 3. 修改：讓 .terms__list 
           (A) 佔滿剩餘空間 (flexGrow: 1)
           (B) 自己負責捲動 (overflowY: auto)
      */}
      {!loading && !err && (
        <div 
          className='terms__list no-scrollbar' // 加上 no-scrollbar
          style={{ 
            flexGrow: 1, 
            overflowY: 'auto' 
          }}
        >
          {filtered.length === 0 ? (
            <div className='terms__empty'>No terms found</div>
          ) : (
            <ul className='terms__ul'>
              {filtered.slice(0, 500).map((t, idx) => (
                <li key={`${t}-${idx}`} className='terms__li'>
                  <a
                    href="#"
                    className='terms__name'
                    title={t}
                    aria-label={`Add term ${t}`}
                    onClick={(e) => { e.preventDefault(); onPickTerm?.(t); }}
                  >
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}