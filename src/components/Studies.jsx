// src/components/Studies.js (或 .jsx)
// *** 這是步驟十一的「最終 CSS 樣式」版本 ***

import { API_BASE } from '../api'
import { useEffect, useMemo, useState } from 'react'

export function classNames (...xs) { return xs.filter(Boolean).join(' ') }

export function Studies ({ query, isCollected, addToCollection, removeFromCollection }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [sortKey, setSortKey] = useState('year')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)
  const pageSize = 20

  useEffect(() => { setPage(1) }, [query])

  useEffect(() => {
    if (!query) return
    let alive = true
    const ac = new AbortController()
    ;(async () => {
      setLoading(true)
      setErr('')
      try {
        const url = `${API_BASE}/query/${encodeURIComponent(query)}/studies`
        const res = await fetch(url, { signal: ac.signal })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`)
        if (!alive) return
        const list = Array.isArray(data?.results) ? data.results : []
        setRows(list)
      } catch (e) {
        if (!alive) return
        setErr(`Unable to fetch studies: ${e?.message || e}`)
        setRows([])
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false; ac.abort() }
  }, [query])

  const changeSort = (key) => {
    if (key === sortKey) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  const sorted = useMemo(() => {
    const arr = [...rows]
    const dir = sortDir === 'asc' ? 1 : -1
    arr.sort((a, b) => {
      const A = a?.[sortKey]
      const B = b?.[sortKey]
      if (sortKey === 'year') return (Number(A || 0) - Number(B || 0)) * dir
      return String(A || '').localeCompare(String(B || ''), 'en') * dir
    })
    return arr
  }, [rows, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const pageRows = sorted.slice((page - 1) * pageSize, page * pageSize)

  return (
    // *** 樣式更新：移除 'border' class，因為 .card 已經有了 ***
    <div className='flex flex-col rounded-2xl'> 
      <div className='flex items-center justify-between p-3'>
        <div className='card__title'>Studies</div>
      </div>

      {query && loading && (
        <div className='grid gap-3 p-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='h-10 animate-pulse rounded-lg bg-gray-100' />
          ))}
        </div>
      )}

      {query && err && (
        <div className='mx-3 mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
          {err}
        </div>
      )}

      {query && !loading && !err && (
        // *** 樣式更新：套用 .studies-table class ***
        <div className='overflow-auto studies-table'> 
          <table className='min-w-full text-sm'>
            {/* *** 樣式更新：移除 'bg-gray-50' *** */}
            <thead className='sticky top-0 text-left'> 
              <tr>
                {[
                  { key: 'year', label: 'Year' },
                  { key: 'journal', label: 'Journal' },
                  { key: 'title', label: 'Title' },
                  { key: 'authors', label: 'Authors' },
                  { key: 'study_id', label: 'PMID' },
                  { key: 'add', label: 'Add' } 
                ].map(({ key, label }) => (
                  <th key={key} className='cursor-pointer px-3 py-2 font-semibold' onClick={() => changeSort(key)}>
                    <span className='inline-flex items-center gap-2'>
                      {label}
                      <span className='text-xs text-gray-500'>{sortKey === key ? (sortDir === 'asc' ? '▲' : '▼') : ''}</span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr><td colSpan={6} className='px-3 py-4 text-gray-500'>No data</td></tr>
              ) : (
                pageRows.map((r, i) => {
                  const collected = isCollected(r.study_id);

                  return (
                    // *** 樣式更新：移除 'bg-white' / 'bg-gray-50' ***
                    <tr key={r.study_id} className={classNames(i % 2 ? 'bg-black bg-opacity-10' : 'bg-transparent')}> 
                      <td className='whitespace-nowrap px-3 py-2 align-top'>{r.year ?? ''}</td>
                      <td className='px-3 py-2 align-top'>{r.journal || ''}</td>
                      <td className='max-w-[540px] px-3 py-2 align-top'><div className='truncate' title={r.title}>{r.title || ''}</div></td>
                      <td className='px-3 py-2 align-top'>{r.authors || ''}</td>
                      <td className='whitespace-nowrap px-3 py-2 align-top'>
                        {r.study_id ? (
                          <a 
                            href={`https://pubmed.ncbi.nlm.nih.gov/${r.study_id}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className='text-emerald-400 hover:underline' // 連結顏色
                          >
                            {r.study_id}
                          </a>
                        ) : ('')}
                      </td>
                      <td className='whitespace-nowrap px-3 py-2 align-top text-center'>
                        <button
                          title={collected ? "Remove from collection" : "Add to my collection"}
                          onClick={() => collected ? removeFromCollection(r.study_id) : addToCollection(r)}
                          // *** 樣式更新：使用 Figma 的 + / - 按鈕顏色 ***
                          className={`px-2 py-1 rounded-full text-lg font-bold ${
                            collected 
                              ? 'bg-yellow-900 text-yellow-100 border border-d9f99d' // 已收藏 (-)
                              : 'bg-lime-300 text-lime-900' // 未收藏 (+)
                          }`}
                          style={{ 
                            width: '30px', 
                            height: '30px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            lineHeight: '1'
                          }}
                        >
                          {collected ? '-' : '+'}
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {query && !loading && !err && (
        // *** 樣式更新：套用 .pagination-button class ***
        <div className='flex items-center justify-between border-t border-emerald-900 p-3 text-sm'>
          <div>Total <b>{sorted.length}</b> records, page <b>{page}</b>/<b>{totalPages}</b></div>
          <div className='flex items-center gap-2'>
            <button disabled={page <= 1} onClick={() => setPage(1)} className='pagination-button rounded-lg px-2 py-1 disabled:opacity-40'>⏮</button>
            <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className='pagination-button rounded-lg px-2 py-1 disabled:opacity-40'>Previous</button>
            <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className='pagination-button rounded-lg px-2 py-1 disabled:opacity-40'>Next</button>
            <button disabled={page >= totalPages} onClick={() => setPage(totalPages)} className='pagination-button rounded-lg px-2 py-1 disabled:opacity-40'>⏭</button>
          </div>
        </div>
      )}
    </div>
  )
}